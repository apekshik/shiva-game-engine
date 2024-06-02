CXX = clang++
CXXFLAGS = -std=c++11 -Wall $(shell sdl2-config --cflags)
LDFLAGS = $(shell sdl2-config --libs) -lSDL2_image

SRCDIR = src
BUILDDIR = build
TARGET = shiva-engine

SRC = $(wildcard $(SRCDIR)/**/*.cpp) $(SRCDIR)/main.cpp
OBJ = $(SRC:$(SRCDIR)/%.cpp=$(BUILDDIR)/%.o)

$(TARGET): $(OBJ)
	$(CXX) -o $@ $^ $(LDFLAGS)

$(BUILDDIR)/%.o: $(SRCDIR)/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c -o $@ $<

clean:
	rm -rf $(BUILDDIR) $(TARGET)

.PHONY: clean
