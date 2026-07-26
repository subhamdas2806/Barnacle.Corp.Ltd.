using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.Web.WebView2.Core;

namespace SmallBrowser
{
    public class BrowserTab : INotifyPropertyChanged
    {
        public Guid Id { get; } = Guid.NewGuid();

        private string _title = "New Tab";
        public string Title
        {
            get => _title;
            set
            {
                if (_title != value)
                {
                    _title = value;
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(StatusHeader));
                }
            }
        }

        private string _url = "https://www.google.com";
        public string Url
        {
            get => _url;
            set
            {
                if (_url != value)
                {
                    _url = value;
                    OnPropertyChanged();
                }
            }
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set
            {
                if (_isLoading != value)
                {
                    _isLoading = value;
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(StatusHeader));
                }
            }
        }

        private bool _isDiscarded;
        public bool IsDiscarded
        {
            get => _isDiscarded;
            set
            {
                if (_isDiscarded != value)
                {
                    _isDiscarded = value;
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(StatusHeader));
                }
            }
        }

        public string StatusHeader => IsDiscarded ? $"[Sleeping] {Title}" : Title;

        public DateTime LastActiveTime { get; set; } = DateTime.Now;

        public Grid Container { get; } = new Grid();

        public WebView2? WebView { get; private set; }

        public event EventHandler<string>? Navigated;
        public event EventHandler<bool>? LoadingStatusChanged;

        public BrowserTab(string? initialUrl = null)
        {
            if (!string.IsNullOrWhiteSpace(initialUrl))
            {
                _url = initialUrl;
            }
            InitWebView();
        }

        public void InitWebView()
        {
            if (WebView != null) return;

            WebView = new WebView2();
            WebView.HorizontalAlignment = HorizontalAlignment.Stretch;
            WebView.VerticalAlignment = VerticalAlignment.Stretch;

            WebView.NavigationStarting += OnNavigationStarting;
            WebView.NavigationCompleted += OnNavigationCompleted;
            WebView.CoreWebView2Initialized += OnCoreWebView2Initialized;

            Container.Children.Clear();
            Container.Children.Add(WebView);

            IsDiscarded = false;

            try
            {
                WebView.Source = new Uri(Url);
            }
            catch
            {
                WebView.Source = new Uri("https://www.google.com");
            }
        }

        private void OnCoreWebView2Initialized(WebView2 sender, CoreWebView2InitializedEventArgs args)
        {
            if (sender.CoreWebView2 != null)
            {
                sender.CoreWebView2.SourceChanged += OnCoreSourceChanged;
                sender.CoreWebView2.DocumentTitleChanged += OnDocumentTitleChanged;
            }
        }

        private void OnCoreSourceChanged(CoreWebView2 sender, CoreWebView2SourceChangedEventArgs args)
        {
            if (!string.IsNullOrWhiteSpace(sender.Source))
            {
                Url = sender.Source;
                Navigated?.Invoke(this, Url);
            }
        }

        public void RestoreIfDiscarded()
        {
            LastActiveTime = DateTime.Now;
            if (IsDiscarded || WebView == null)
            {
                InitWebView();
            }
        }

        public void Discard()
        {
            if (IsDiscarded || WebView == null) return;

            // Capture current URL and Title before disposing
            if (WebView.Source != null)
            {
                Url = WebView.Source.ToString();
            }

            if (WebView.CoreWebView2 != null && !string.IsNullOrWhiteSpace(WebView.CoreWebView2.DocumentTitle))
            {
                Title = WebView.CoreWebView2.DocumentTitle;
            }

            // Unhook event handlers
            WebView.NavigationStarting -= OnNavigationStarting;
            WebView.NavigationCompleted -= OnNavigationCompleted;
            WebView.CoreWebView2Initialized -= OnCoreWebView2Initialized;

            if (WebView.CoreWebView2 != null)
            {
                WebView.CoreWebView2.SourceChanged -= OnCoreSourceChanged;
                WebView.CoreWebView2.DocumentTitleChanged -= OnDocumentTitleChanged;
            }

            // Remove WebView from Visual Tree and close/dispose it to reclaim RAM
            Container.Children.Clear();

            try
            {
                WebView.Close();
            }
            catch
            {
                // Ignore exception if already closed
            }

            WebView = null;
            IsDiscarded = true;
            IsLoading = false;

            // Trigger Garbage Collector to clean up unmanaged WebView2 process host memory
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }

        private void OnNavigationStarting(WebView2 sender, CoreWebView2NavigationStartingEventArgs args)
        {
            IsLoading = true;
            if (sender.Source != null)
            {
                Url = sender.Source.ToString();
                Navigated?.Invoke(this, Url);
            }
            LoadingStatusChanged?.Invoke(this, true);
        }

        private void OnNavigationCompleted(WebView2 sender, CoreWebView2NavigationCompletedEventArgs args)
        {
            IsLoading = false;
            LoadingStatusChanged?.Invoke(this, false);

            if (sender.CoreWebView2 != null && !string.IsNullOrWhiteSpace(sender.CoreWebView2.DocumentTitle))
            {
                Title = sender.CoreWebView2.DocumentTitle;
            }

            if (sender.Source != null)
            {
                Url = sender.Source.ToString();
                Navigated?.Invoke(this, Url);
            }
        }

        private void OnDocumentTitleChanged(CoreWebView2 sender, object args)
        {
            if (!string.IsNullOrWhiteSpace(sender.DocumentTitle))
            {
                Title = sender.DocumentTitle;
            }
        }

        public void Navigate(string targetUrl)
        {
            RestoreIfDiscarded();
            string parsed = UrlHelper.ParseInput(targetUrl);
            Url = parsed;

            if (WebView != null)
            {
                try
                {
                    WebView.Source = new Uri(parsed);
                }
                catch
                {
                    // Fallback
                }
            }
        }

        public void GoBack()
        {
            if (WebView != null && WebView.CanGoBack)
            {
                WebView.GoBack();
            }
        }

        public void GoForward()
        {
            if (WebView != null && WebView.CanGoForward)
            {
                WebView.GoForward();
            }
        }

        public void Reload()
        {
            RestoreIfDiscarded();
            if (WebView != null)
            {
                WebView.Reload();
            }
        }

        public void Stop()
        {
            if (WebView != null && WebView.CoreWebView2 != null)
            {
                WebView.CoreWebView2.Stop();
            }
            IsLoading = false;
            LoadingStatusChanged?.Invoke(this, false);
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
