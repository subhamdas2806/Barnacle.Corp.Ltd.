using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;

namespace SmallBrowser
{
    public sealed partial class MainWindow : Window
    {
        private readonly List<BrowserTab> _tabs = new List<BrowserTab>();
        private readonly DispatcherTimer _discardTimer = new DispatcherTimer();
        private TimeSpan _discardTimeout = TimeSpan.FromMinutes(5);
        private BrowserTab? _activeTab;

        public MainWindow()
        {
            this.InitializeComponent();

            // Setup Custom TitleBar
            ExtendsContentIntoTitleBar = true;
            SetTitleBar(AppTitleBar);

            // Initialize Hibernation Check Timer (runs every 15 seconds)
            _discardTimer.Interval = TimeSpan.FromSeconds(15);
            _discardTimer.Tick += DiscardTimer_Tick;
            _discardTimer.Start();

            // Create initial homepage tab
            CreateNewTab("https://www.google.com");
        }

        private BrowserTab? ActiveTab => _activeTab;

        private void CreateNewTab(string? initialUrl = null)
        {
            var tab = new BrowserTab(initialUrl);
            _tabs.Add(tab);

            var tabViewItem = new TabViewItem
            {
                Header = tab.StatusHeader,
                IconSource = new FontIconSource { Glyph = "\uE774" },
                Tag = tab
            };

            tab.PropertyChanged += (s, e) =>
            {
                if (e.PropertyName == nameof(BrowserTab.StatusHeader) || e.PropertyName == nameof(BrowserTab.Title))
                {
                    DispatcherQueue.TryEnqueue(() =>
                    {
                        tabViewItem.Header = tab.StatusHeader;
                        if (tab.IsDiscarded)
                        {
                            tabViewItem.IconSource = new FontIconSource { Glyph = "\uE945" }; // Sleep/moon icon
                        }
                        else
                        {
                            tabViewItem.IconSource = new FontIconSource { Glyph = "\uE774" }; // Globe icon
                        }
                    });
                }

                if (tab == ActiveTab && e.PropertyName == nameof(BrowserTab.Url))
                {
                    DispatcherQueue.TryEnqueue(() =>
                    {
                        AddressBar.Text = tab.Url;
                    });
                }
            };

            tab.Navigated += (s, url) =>
            {
                if (tab == ActiveTab)
                {
                    DispatcherQueue.TryEnqueue(() =>
                    {
                        AddressBar.Text = url;
                        UpdateNavigationButtonState();
                    });
                }
            };

            tab.LoadingStatusChanged += (s, isLoading) =>
            {
                if (tab == ActiveTab)
                {
                    DispatcherQueue.TryEnqueue(() =>
                    {
                        LoadingRing.IsActive = isLoading;
                    });
                }
            };

            MainTabView.TabItems.Add(tabViewItem);
            MainTabView.SelectedItem = tabViewItem;
        }

        private void MainTabView_AddTabButtonClick(TabView sender, object args)
        {
            CreateNewTab("https://www.google.com");
        }

        private void MainTabView_TabCloseRequested(TabView sender, TabViewTabCloseRequestedEventArgs args)
        {
            if (args.Item is TabViewItem item && item.Tag is BrowserTab tab)
            {
                // Free tab resources
                tab.Discard();
                _tabs.Remove(tab);
                MainTabView.TabItems.Remove(item);

                // Ensure there is always at least one tab open
                if (MainTabView.TabItems.Count == 0)
                {
                    CreateNewTab("https://www.google.com");
                }
            }
        }

        private void MainTabView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (MainTabView.SelectedItem is TabViewItem item && item.Tag is BrowserTab tab)
            {
                _activeTab = tab;
                tab.LastActiveTime = DateTime.Now;

                // Re-create WebView2 if tab was sleeping/discarded
                tab.RestoreIfDiscarded();

                // Display active tab's view container
                TabContentContainer.Children.Clear();
                TabContentContainer.Children.Add(tab.Container);

                // Sync navigation bar UI
                AddressBar.Text = tab.Url;
                LoadingRing.IsActive = tab.IsLoading;
                UpdateNavigationButtonState();
            }
        }

        private void UpdateNavigationButtonState()
        {
            if (ActiveTab?.WebView != null)
            {
                BackButton.IsEnabled = ActiveTab.WebView.CanGoBack;
                ForwardButton.IsEnabled = ActiveTab.WebView.CanGoForward;
            }
            else
            {
                BackButton.IsEnabled = false;
                ForwardButton.IsEnabled = false;
            }
        }

        private void AddressBar_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == Windows.System.VirtualKey.Enter)
            {
                e.Handled = true;
                if (ActiveTab != null && !string.IsNullOrWhiteSpace(AddressBar.Text))
                {
                    ActiveTab.Navigate(AddressBar.Text);
                }
            }
        }

        private void AddressBar_GotFocus(object sender, RoutedEventArgs e)
        {
            AddressBar.SelectAll();
        }

        private void BackButton_Click(object sender, RoutedEventArgs e)
        {
            ActiveTab?.GoBack();
        }

        private void ForwardButton_Click(object sender, RoutedEventArgs e)
        {
            ActiveTab?.GoForward();
        }

        private void ReloadButton_Click(object sender, RoutedEventArgs e)
        {
            ActiveTab?.Reload();
        }

        private void StopButton_Click(object sender, RoutedEventArgs e)
        {
            ActiveTab?.Stop();
        }

        private void DiscardCurrentButton_Click(object sender, RoutedEventArgs e)
        {
            if (ActiveTab != null)
            {
                ActiveTab.Discard();
                TabContentContainer.Children.Clear();
            }
        }

        private void DiscardTimeoutCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (DiscardTimeoutCombo.SelectedIndex == 0)
            {
                _discardTimeout = TimeSpan.FromMinutes(1);
            }
            else if (DiscardTimeoutCombo.SelectedIndex == 1)
            {
                _discardTimeout = TimeSpan.FromMinutes(5);
            }
            else if (DiscardTimeoutCombo.SelectedIndex == 2)
            {
                _discardTimeout = TimeSpan.FromMinutes(10);
            }
            else
            {
                _discardTimeout = TimeSpan.MaxValue; // Never
            }
        }

        private void DiscardTimer_Tick(object? sender, object e)
        {
            if (_discardTimeout == TimeSpan.MaxValue) return;

            DateTime now = DateTime.Now;
            foreach (var tab in _tabs.ToList())
            {
                // NEVER discard the currently active tab
                if (tab == ActiveTab) continue;

                // Skip tabs already discarded
                if (tab.IsDiscarded) continue;

                // Check inactivity duration
                if ((now - tab.LastActiveTime) >= _discardTimeout)
                {
                    tab.Discard();
                }
            }
        }
    }
}
