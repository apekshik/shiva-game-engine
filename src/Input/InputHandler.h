#ifndef INPUTHANDLER_H
#define INPUTHANDLER_H

#include <SDL.h>
#include <map>

class InputHandler {
public:
    InputHandler();
    ~InputHandler();

    void update();
    bool isKeyPressed(SDL_Keycode key);

private:
    std::map<SDL_Keycode, bool> keyMap;
};

#endif
