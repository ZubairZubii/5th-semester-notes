// main.cpp
#include <iostream>
#include <thread>
#include <vector>
#include <mutex>
#include "board.h"
#include "dice.h"
using namespace std;

#define NUM_PLAYERS 4


class Player {
public:
    int id;  
    int position;  

    Player(int id) : id(id), position(0) {}

    void play_turn() {

        cout << "Player " << id << "'s turn:\n";
        roll_dice();
        display_dice();


        position += dice_roll;
        cout << "Player " << id << " moved to position " << position << "\n";
    }
};


void run_game(vector<Player>& players) {

    for (int round = 1; round <= 5; ++round) {
       cout << "\nRound " << round << ":\n";

 
        for (auto& player : players) {
            player.play_turn();
        }
    }
}

int main() {

    char grid[GRID_SIZE][GRID_SIZE];
    initialize_grid(grid);

    cout << "Initial Game Board:\n";
    display_grid(grid);


    vector<Player> players;
    for (int i = 0; i < NUM_PLAYERS; ++i) {
        players.push_back(Player(i + 1));
    }


    vector<thread> threads;

    for (auto& player : players) {

        threads.push_back(thread([&player]() {
            player.play_turn();
            }));


    }


    for (auto& t : threads) {
        t.join();
    }


    run_game(players);

    return 0;
}
