#include <iostream>
#include <mutex>
#include <cstdlib> 
#include <ctime>   
#include "dice.h"
using namespace std;


int dice_roll = 0;
mutex dice_mutex;

void roll_dice() {
    lock_guard<mutex> lock(dice_mutex);


    static bool seeded = false;
    if (!seeded) {
        srand(time(0)); 
        seeded = true;
    }

    dice_roll = rand() % 6 + 1;
}


void display_dice() {
    cout << "Dice Roll: " << dice_roll << endl;
}

