#include "InputHandler.h"

InputHandler::InputHandler() {}

InputHandler::~InputHandler() {}

void InputHandler::update() {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        if (event.type == SDL_KEYDOWN) {
            keyMap[event.key.keysym.sym] = true;
        } else if (event.type == SDL_KEYUP) {
            keyMap[event.key.keysym.sym] = false;
        }
    }
}

bool InputHandler::isKeyPressed(SDL_Keycode key) {
    return keyMap[key];
}
