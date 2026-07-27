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
        private BrowserTab? _activeTab;

        public MainWindow()
        {
            this.InitializeComponent();

            ExtendsContentIntoTitleBar = true;

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
            if (MainTabView.SelectedItem is TabViewItem item && item.Tag is BrowserTab selectedTab)
            {
                _activeTab = selectedTab;

                // Auto-sleep ALL inactive tabs immediately upon switching tabs
                foreach (var tab in _tabs.ToList())
                {
                    if (tab != selectedTab && !tab.IsDiscarded)
                    {
                        tab.Discard();
                    }
                }

                // Restore/wake up selected tab
                selectedTab.RestoreIfDiscarded();

                // Display active tab's view container
                TabContentContainer.Children.Clear();
                TabContentContainer.Children.Add(selectedTab.Container);

                // Sync navigation bar UI
                AddressBar.Text = selectedTab.Url;
                LoadingRing.IsActive = selectedTab.IsLoading;
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
    }
}
