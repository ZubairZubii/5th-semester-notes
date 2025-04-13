#include <iostream>
#include <thread>
#include <chrono>
#include <iomanip>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

void centerText(const string& text, int width = 120) {
    int pad = max(0, (width - static_cast<int>(text.length())) / 2);
    cout << string(pad, ' ') << text << endl;
}

void splashScreen() {
    system("clear"); // Use "cls" for Windows

    // Colorful Sajjal Zubair ASCII Art with Gradient Effect
    vector<string> sajjalZubairArt = {
        "\033[1;31m███████╗ █████╗      ██╗     ██╗ █████╗ ██╗     \033[0m",
        "\033[1;33m██╔════╝██╔══██╗     ██║     ██║██╔══██╗██║     \033[0m",
        "\033[1;32m███████╗███████║     ██║     ██║███████║██║     \033[0m",
        "\033[1;34m╚════██║██╔══██║██   ██║██   ██║██╔══██║██║     \033[0m",
        "\033[1;35m███████║██║  ██║╚█████╔╝╚█████╔╝██║  ██║███████╗\033[0m",
        "\033[1;36m╚══════╝╚═╝  ╚═╝ ╚════╝  ╚════╝ ╚═╝  ╚═╝╚══════╝\033[0m",
        "",
        "\033[1;31m███████╗██╗   ██╗██████╗  █████╗ ██╗██████╗     \033[0m",
        "\033[1;33m╚══███╔╝██║   ██║██╔══██╗██╔══██╗██║██╔══██╗    \033[0m",
        "\033[1;32m  ███╔╝ ██║   ██║██████╔╝███████║██║██████╔╝    \033[0m",
        "\033[1;34m ███╔╝  ██║   ██║██╔══██╗██╔══██║██║██╔══██╗    \033[0m",
        "\033[1;35m███████╗╚██████╔╝██████╔╝██║  ██║██║██║  ██║    \033[0m",
        "\033[1;36m╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝    \033[0m"
    };

    // Center and print the colorful logo
    cout << endl;
    for (const auto& line : sajjalZubairArt) {
        centerText(line, 130);
    }

    // Enhanced Welcome Message with Decorative Borders
    string welcomeMessage = "🎉 WELCOME TO THE NEW YEAR CELEBRATION! 🎊";
    string border = string(welcomeMessage.length(), '=');

    // Colorful, Animated Welcome
    cout << endl;
    centerText(border, 130);
    centerText(welcomeMessage, 130);
    centerText(border, 130);

    // Animated Loading Message
    vector<string> loadingMessages = {
        "🎆 Preparing Fireworks...",
        "🥂 Chilling Champagne...",
        "🕰️ Synchronizing Countdown...",
        "🎵 Queuing Party Music..."
    };

    cout << endl;
    for (const auto& msg : loadingMessages) {
        centerText("\033[1;36m" + msg + "\033[0m", 130);
        this_thread::sleep_for(chrono::milliseconds(500));
    }

    // Final Loading Indication
    cout << endl;
    centerText("\033[1;32m✨ New Year Celebration Ready! Let's Party! ✨\033[0m", 130);

    // Wait for a moment
    this_thread::sleep_for(chrono::seconds(2));
    system("clear");
}

void flashingNewYear(int year, int flashes = 20, int delay = 100) {
    vector<string> colors = {
        "\033[1;31m",  // Red
        "\033[1;33m",  // Yellow
        "\033[1;32m",  // Green
        "\033[1;34m",  // Blue
        "\033[1;35m",  // Magenta
        "\033[1;36m"   // Cyan
    };

    vector<string> icons = { "🎉", "🎊", "🥳", "🎆", "🎇", "✨" };

    stringstream ss;
    ss << "HAPPY NEW YEAR " << year << "!";
    string text = ss.str();

    for (int i = 0; i < flashes; ++i) {
        string color = colors[i % colors.size()];
        string icon1 = icons[i % icons.size()];
        string icon2 = icons[(i + 1) % icons.size()];

        string flashText = icon1 + " " + color + text + "\033[0m " + icon2;

        cout << "\033[2J\033[H"; // Clear screen and move cursor to top-left
        cout << endl << endl;
        centerText(flashText, 130);

        this_thread::sleep_for(chrono::milliseconds(delay));
    }

    // Final stable display
    cout << "\033[2J\033[H"; // Clear screen and move cursor to top-left
    cout << endl << endl;
    centerText("\033[1;36m🎉 HAPPY NEW YEAR " + to_string(year) + "! 🎊\033[0m", 130);
    cout << endl;
    centerText("\033[1;33m🌟 May Your Year Be Filled With Joy and Success! 🌟\033[0m", 130);
}

int main() {
    splashScreen();
    flashingNewYear(2024); // Change the year as needed
    return 0;
}