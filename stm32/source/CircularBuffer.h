#ifndef __CIRCULAR_BUFFER_H__
#define __CIRCULAR_BUFFER_H__

#include "mbed.h"
#include <vector>
#include <stdexcept>

template<typename T, size_t Size>
class Circular_Buffer {
public:
    Circular_Buffer() : head(0), tail(0), is_full(false) {}

    void put(T item) {
        buffer[head] = item;
        if (is_full) {
            tail = (tail + 1) % Size;
        }
        head = (head + 1) % Size;
        is_full = head == tail;
    }

    bool get(T& item) {
        if (isEmpty()) {
            return false; // Indicate buffer is empty
        }
        item = buffer[tail];
        is_full = false;
        tail = (tail + 1) % Size;
        return true;
    }

    void reset() {
        head = tail = 0;
        is_full = false;
    }

    bool isEmpty() const {
        return (!is_full && (head == tail));
    }

    bool isFull() const {
        return is_full;
    }

    size_t capacity() const {
        return Size;
    }

    size_t size() const {
        size_t size = Size;
        if (!is_full) {
            if (head >= tail) {
                size = head - tail;
            } else {
                size = Size + head - tail;
            }
        }
        return size;
    }

    void printBuffer() const {
        printf("Buffer contents: ");
        if (isEmpty()) {
            printf("Buffer is empty\n");
            return;
        }
        
        size_t current = tail;
        do {
            printf("%d ", buffer[current]);
            current = (current + 1) % Size;
        } while (current != head);
        printf("\n");
    }

    size_t getCurrentSize() const {
        return size();
    }

    size_t getCapacity() const {
        return capacity();
    }

private:
    T buffer[Size];
    size_t head;
    size_t tail;
    bool is_full;
};
#endif