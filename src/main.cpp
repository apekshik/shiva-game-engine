#include "Core/Engine.h"

int main(int argc, char* argv[]) {
    Engine* engine = new Engine();

    if (engine->init("Shiva 2D Game Engine", 800, 600, false)) {
        while (engine->running()) {
            engine->handleEvents();
            engine->update_game_state();
            engine->render();
        }
    }

    engine->clean();
    delete engine;

    return 0;
}
