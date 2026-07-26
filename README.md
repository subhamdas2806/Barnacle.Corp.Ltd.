# SmallBrowser - Minimal Windows Browser Shell

A bare-bones, ultra-low-RAM desktop browser built with **WinUI 3 (C#)** and **Microsoft WebView2**.

Designed with **zero unnecessary background overhead**: no extensions, no password manager, no bookmarks, no history tracking, no telemetry, and no sync services.

---

## Key Features

1. **Tab Strip Management**
   - Create new tabs (`+` button).
   - Close tabs (`x` button on tab).
   - Switch between open tabs smoothly.
   - Each active tab hosts its own isolated `WebView2` instance.

2. **Smart Address Bar Navigation**
   - Automatically navigates if the input is a valid URL, domain name, localhost, or IP address.
   - Converts general search queries into Google searches (`https://www.google.com/search?q=...`).
   - Dynamically displays the current tab's active URL.

3. **Navigation & Loading Controls**
   - Standard Back, Forward, Reload, and Stop buttons.
   - Active loading spinner tied directly to WebView2 `NavigationStarting` and `NavigationCompleted` lifecycle events.

4. **Tab Hibernation / RAM Discarding**
   - Automatically disposes `WebView2` controls and Chromium processes for tabs inactive for N minutes (configurable: 1 min, 5 min, 10 min, or Never).
   - Retains tab metadata (Title and URL) while hibernated, displaying `[Sleeping]` in the tab header.
   - Instantly recreates the `WebView2` instance and restores the page state when switching back.
   - **Never discards the currently active tab.**
   - Includes a manual **"Sleep Tab"** button to force instant RAM freeing.

5. **Clean Windows Chrome**
   - Resizable WinUI 3 window with custom title bar.

---

## Tech Stack

- **Framework**: WinUI 3 (Windows App SDK 1.5+ / .NET 8)
- **Engine**: Microsoft.Web.WebView2 (uses system-installed Edge/Chromium runtime)
- **Language**: C# 12 / .NET 8.0

---

## Building and Running

### Prerequisites
- Windows 10/11
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Build & Run Commands
```powershell
# Restore and build the project
dotnet build SmallBrowser.csproj -c Release

# Run the executable
.\bin\Release\net8.0-windows10.0.26100.0\win-x64\SmallBrowser.exe
```
