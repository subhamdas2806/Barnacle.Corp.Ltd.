using System;
using System.Text.RegularExpressions;

namespace SmallBrowser
{
    public static class UrlHelper
    {
        private static readonly Regex DomainRegex = new Regex(
            @"^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d+)?(?:/.*)?$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

        private static readonly Regex IpRegex = new Regex(
            @"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?(?:/.*)?$",
            RegexOptions.Compiled);

        private static readonly Regex LocalhostRegex = new Regex(
            @"^localhost(?::\d+)?(?:/.*)?$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public static string ParseInput(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return "https://www.google.com";
            }

            string trimmed = input.Trim();

            // Explicit protocols
            if (trimmed.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                trimmed.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
                trimmed.StartsWith("file:///", StringComparison.OrdinalIgnoreCase) ||
                trimmed.StartsWith("about:", StringComparison.OrdinalIgnoreCase))
            {
                return trimmed;
            }

            // Contains spaces -> definitely a search query
            if (trimmed.Contains(' '))
            {
                return CreateGoogleSearchUrl(trimmed);
            }

            // Check if matches domain, IP, or localhost pattern
            if (DomainRegex.IsMatch(trimmed) || IpRegex.IsMatch(trimmed) || LocalhostRegex.IsMatch(trimmed))
            {
                return "https://" + trimmed;
            }

            // Fallback: try parsing as absolute Uri
            if (Uri.TryCreate(trimmed, UriKind.Absolute, out Uri? uriResult) &&
                (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
            {
                return uriResult.AbsoluteUri;
            }

            // Default to search query
            return CreateGoogleSearchUrl(trimmed);
        }

        private static string CreateGoogleSearchUrl(string query)
        {
            return $"https://www.google.com/search?q={Uri.EscapeDataString(query)}";
        }
    }
}
