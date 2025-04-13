#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <time.h>

// Global dice variables
pthread_mutex_t dice_mutex;
int dice_value;

// Initialize the dice mutex
void initialize_dice() {
    pthread_mutex_init(&dice_mutex, NULL);  // Initialize the mutex
    srand(time(NULL));  // Seed the random number generator for randomness
}

// Roll dice function
int roll_dice() {
    pthread_mutex_lock(&dice_mutex);          // Lock the mutex to ensure thread-safe dice roll
    dice_value = rand() % 6 + 1;              // Generate a number between 1 and 6 (inclusive)
    printf("Dice rolled: %d\n", dice_value);  // Print the dice value (optional)
    pthread_mutex_unlock(&dice_mutex);        // Unlock the mutex
    return dice_value;
}

// Destroy the dice mutex
void destroy_dice() {
    pthread_mutex_destroy(&dice_mutex);  // Clean up the mutex
}
