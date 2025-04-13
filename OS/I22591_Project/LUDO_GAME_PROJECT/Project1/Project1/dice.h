// dice.h
#ifndef DICE_H
#define DICE_H
#include <mutex>
using namespace std;

extern int dice_roll;
extern mutex dice_mutex;


void roll_dice();


void display_dice();

#endif 
