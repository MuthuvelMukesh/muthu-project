// Include standard input/output library for functions like printf and scanf
#include <stdio.h>
// Include standard library for memory allocation (malloc, free) and exit
#include <stdlib.h>
// Include string library for string operations like strcpy, strcmp, and strlen
#include <string.h>
// Include ctype library for character handling functions like tolower and isspace
#include <ctype.h>

// Define a structure for a node in the linked list
typedef struct Node {
    char word[50];          // Array to store the word (max 49 chars + null terminator)
    char definition[100];   // Array to store the definition (max 99 chars + null terminator)
    struct Node* next;      // Pointer to the next node in the linked list
} Node;                     // Name of the structure is Node

// Global variable to track the total number of words in the dictionary
int wordCount = 0;

// Function to create a new node for the linked list
Node* createNode(const char* word, const char* definition) {
    // Allocate memory for a new Node
    Node* newNode = (Node*)malloc(sizeof(Node));
    // Check if memory allocation was successful
    if (!newNode) {
        // Print error message if allocation fails
        printf("Error: Memory allocation failed!\n");
        // Exit program with error code 1
        exit(1);
    }
    // Copy word into newNode->word, ensuring it doesn't exceed buffer size
    strncpy(newNode->word, word, sizeof(newNode->word) - 1);
    // Ensure null termination of word string
    newNode->word[sizeof(newNode->word) - 1] = '\0';
    // Copy definition into newNode->definition, ensuring it doesn't exceed buffer size
    strncpy(newNode->definition, definition, sizeof(newNode->definition) - 1);
    // Ensure null termination of definition string
    newNode->definition[sizeof(newNode->definition) - 1] = '\0';
    // Set the next pointer to NULL (new node is not linked yet)
    newNode->next = NULL;
    // Return pointer to the new node
    return newNode;
}

// Function to clean input string by trimming whitespace and converting to lowercase
void cleanInput(char* str) {
    // Initialize indices for processing the string
    int i, j = 0;
    // Get the length of the input string
    size_t len = strlen(str);
    // Skip leading whitespace characters
    while (isspace((unsigned char)str[j])) j++;
    // Copy non-whitespace characters to the start, converting to lowercase
    for (i = 0; j < len && !isspace((unsigned char)str[j]); i++, j++) {
        str[i] = tolower((unsigned char)str[j]);
    }
    // Null terminate the cleaned string
    str[i] = '\0';
    // Remove trailing newline if present
    if (i > 0 && str[i - 1] == '\n') str[i - 1] = '\0';
}

// Function to check if a word already exists in the dictionary
int exists(Node* head, const char* word) {
    // Start at the head of the linked list
    Node* current = head;
    // Traverse the list
    while (current) {
        // Compare current node's word with the input word
        if (strcmp(current->word, word) == 0) return 1; // Return 1 if match found
        current = current->next; // Move to the next node
    }
    // Return 0 if word is not found
    return 0;
}

// Function to insert a word and definition into the dictionary in alphabetical order
void insert(Node** head, const char* word, const char* definition) {
    // Create a buffer for the cleaned word
    char cleanWord[50];
    // Copy input word to buffer
    strcpy(cleanWord, word);
    // Clean the word (trim whitespace, convert to lowercase)
    cleanInput(cleanWord);
    
    // Check if the cleaned word is empty
    if (strlen(cleanWord) == 0) {
        // Print error if word is empty
        printf("Error: Word cannot be empty.\n");
        return;
    }
    // Check if the word already exists in the dictionary
    if (exists(*head, cleanWord)) {
        // Print error if word is a duplicate
        printf("Error: '%s' already exists in the dictionary.\n", cleanWord);
        return;
    }
    
    // Create a new node with the cleaned word and definition
    Node* newNode = createNode(cleanWord, definition);
    // If list is empty or new word comes before the head word
    if (!*head || strcmp(cleanWord, (*head)->word) < 0) {
        // Set new node's next to current head
        newNode->next = *head;
        // Update head to point to new node
        *head = newNode;
    } else {
        // Find the correct position to insert the new node
        Node* current = *head;
        // Traverse until end or a word greater than cleanWord is found
        while (current->next && strcmp(current->next->word, cleanWord) < 0) {
            current = current->next;
        }
        // Insert new node after current
        newNode->next = current->next;
        current->next = newNode;
    }
    // Increment word count
    wordCount++;
    // Print success message with updated word count
    printf("Successfully added '%s'. Total words: %d\n", cleanWord, wordCount);
}

// Function to search for a word in the dictionary
void search(Node* head, const char* word) {
    // Create a buffer for the cleaned word
    char cleanWord[50];
    // Copy input word to buffer
    strcpy(cleanWord, word);
    // Clean the word (trim whitespace, convert to lowercase)
    cleanInput(cleanWord);
    
    // Start at the head of the linked list
    Node* current = head;
    // Traverse the list
    while (current) {
        // Compare current node's word with the cleaned word
        if (strcmp(current->word, cleanWord) == 0) {
            // Print word and definition if found
            printf("Found: %s - %s\n", current->word, current->definition);
            return;
        }
        current = current->next; // Move to the next node
    }
    // Print message if word is not found
    printf("'%s' not found in dictionary.\n", cleanWord);
}

// Function to display all words and definitions in the dictionary
void display(Node* head) {
    // Check if the dictionary is empty
    if (!head) {
        // Print message if empty
        printf("Dictionary is empty. Total words: %d\n", wordCount);
        return;
    }
    // Print header for dictionary contents
    printf("\n--- Dictionary Contents ---\n");
    // Start at the head of the linked list
    Node* current = head;
    // Traverse the list
    while (current) {
        // Print current word and definition, left-aligning word
        printf("%-20s : %s\n", current->word, current->definition);
        current = current->next; // Move to the next node
    }
    // Print total word count
    printf("Total words: %d\n", wordCount);
    // Print footer
    printf("-------------------------\n");
}

// Function to delete a word from the dictionary
void delete(Node** head, const char* word) {
    // Create a buffer for the cleaned word
    char cleanWord[50];
    // Copy input word to buffer
    strcpy(cleanWord, word);
    // Clean the word (trim whitespace, convert to lowercase)
    cleanInput(cleanWord);
    
    // Check if the dictionary is empty
    if (!*head) {
        // Print message if empty
        printf("Dictionary is empty.\n");
        return;
    }
    
    // Temporary pointer for node to be deleted
    Node* temp;
    // Check if the head node contains the word to delete
    if (strcmp((*head)->word, cleanWord) == 0) {
        // Store head in temp
        temp = *head;
        // Update head to next node
        *head = (*head)->next;
        // Free the memory of the deleted node
        free(temp);
        // Decrement word count
        wordCount--;
        // Print success message
        printf("Deleted '%s'. Total words: %d\n", cleanWord, wordCount);
        return;
    }
    
    // Find the node before the one to delete
    Node* current = *head;
    // Traverse until the next node's word matches or end is reached
    while (current->next && strcmp(current->next->word, cleanWord) != 0) {
        current = current->next;
    }
    
    // Check if the word was found
    if (!current->next) {
        // Print message if word is not found
        printf("'%s' not found in dictionary.\n", cleanWord);
        return;
    }
    
    // Store node to delete in temp
    temp = current->next;
    // Update link to skip the deleted node
    current->next = temp->next;
    // Free the memory of the deleted node
    free(temp);
    // Decrement word count
    wordCount--;
    // Print success message
    printf("Deleted '%s'. Total words: %d\n", cleanWord, wordCount);
}

// Function to free all nodes in the linked list
void freeList(Node** head) {
    // Start at the head of the linked list
    Node* current = *head;
    // Traverse the list
    while (current) {
        // Store current node in temp
        Node* temp = current;
        // Move to the next node
        current = current->next;
        // Free the memory of the current node
        free(temp);
    }
    // Set head to NULL to indicate an empty list
    *head = NULL;
    // Reset word count to 0
    wordCount = 0;
}

// Main function to run the interactive dictionary program
int main() {
    // Initialize an empty dictionary (linked list)
    Node* dictionary = NULL;
    // Buffers for user input
    char word[50], definition[100];
    // Variable to store user's menu choice
    int choice;

    // Print program title and description
    printf("=== Linked List Word Dictionary ===\n");
    printf("Data Structure: Singly Linked List\n");
    printf("Purpose: Store words and definitions in alphabetical order\n");
    
    // Main loop for user interaction
    while (1) {
        // Print menu options
        printf("\n--- Menu ---\n");
        printf("1. Insert a word\n");
        printf("2. Search for a word\n");
        printf("3. Delete a word\n");
        printf("4. Display dictionary\n");
        printf("5. Exit\n");
        printf("Choice (1-5): ");
        
        // Read user's choice and validate input
        if (scanf("%d", &choice) != 1) {
            // Print error if input is not a number
            printf("Error: Invalid input. Please enter a number.\n");
            // Clear input buffer
            while (getchar() != '\n');
            continue;
        }
        // Clear newline from input buffer
        getchar();

        // Validate choice range
        if (choice < 1 || choice > 5) {
            // Print error if choice is out of range
            printf("Error: Choice must be between 1 and 5.\n");
            continue;
        }

        // Handle menu choices
        switch (choice) {
            case 1:  // Insert a word
                // Prompt for word
                printf("Enter word (max 49 chars): ");
                // Read word, check for input error
                if (!fgets(word, sizeof(word), stdin)) continue;
                // Prompt for definition
                printf("Enter definition (max 99 chars): ");
                // Read definition, check for input error
                if (!fgets(definition, sizeof(definition), stdin)) continue;
                // Insert word and definition into dictionary
                insert(&dictionary, word, definition);
                break;

            case 2:  // Search for a word
                // Prompt for word
                printf("Enter word to search: ");
                // Read word, check for input error
                if (!fgets(word, sizeof(word), stdin)) continue;
                // Search for the word in the dictionary
                search(dictionary, word);
                break;

            case 3:  // Delete a word
                // Prompt for word
                printf("Enter word to delete: ");
                // Read word, check for input error
                if (!fgets(word, sizeof(word), stdin)) continue;
                // Delete the word from the dictionary
                delete(&dictionary, word);
                break;

            case 4:  // Display dictionary
                // Display all words and definitions
                display(dictionary);
                break;

            case 5:  // Exit program
                // Print exit message
                printf("Exiting... Cleaning up memory.\n");
                // Free all nodes in the dictionary
                freeList(&dictionary); // Pass pointer to dictionary pointer
                // Exit program
                return 0;
        }
    }
    // Return 0 (unreachable due to infinite loop)
    return 0;
}

