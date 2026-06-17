# Intel 8080 Emulator & Assembler - Version 1.0.0

A web-based Intel 8080 CPU emulator and assembler built with 100% pure JavaScript, HTML, and CSS. No frameworks, no dependencies. Designed for educational purposes and compatible with GitHub Pages.

## Features

- **8080 CPU Core**: Accurate emulation of the Intel 8080 instruction set.
  - Full support for Arithmetic, Logic, Data Transfer, Branching, and Stack instructions.
  - Implemented `DAA` (Decimal Adjust Accumulator).
  - Accurate Flag management (Sign, Zero, Auxiliary Carry, Parity, Carry).
- **Integrated Assembler**: Write and assemble 8080 mnemonics directly in the browser.
  - Supports labels and comments.
  - Supports `ORG` and `DB` directives.
  - Handles hex (e.g., `12H`, `0x12`) and decimal values.
- **CPU Dashboard**:
  - Real-time visualization of all registers (A, B, C, D, E, H, L, PC, SP).
  - Individual flag indicators.
  - Status display (Idle, Running, Halted).
- **Interactive Memory Viewer**:
  - Live memory grid with search-by-address functionality.
  - Highlights the current instruction pointer (PC).
- **Execution Controls**:
  - **Assemble & Load**: Compiles your code and places it in memory.
  - **Run**: Executes the code at high speed.
  - **Stop**: Pauses execution.
  - **Step**: Executes one instruction at a time.
  - **Reset**: Clears registers and flags, resets PC to 0000H.

## How to Use

1. Open `index.html` in any modern web browser.
2. Write your 8080 Assembly code in the "Assembler" text area.
3. Click **Assemble & Load**.
4. Use **Step** to debug or **Run** to execute the full program.
5. Watch the **Registers** and **Memory View** to see your code in action.

### Example Code
```assembly
MVI A, 05H   ; Load 5 into Register A
MVI B, 0AH   ; Load 10 into Register B
ADD B        ; Add B to A (Result 15 in A)
STA 2000H    ; Store result at memory address 2000H
HLT          ; Halt execution
```

## Project Structure

- `index.html`: Main UI structure.
- `styles.css`: UI styling and layout.
- `cpu.js`: Intel 8080 CPU emulation logic.
- `assembler.js`: 8080 Assembler and machine code generator.
- `main.js`: UI integration and execution loop.

## Deployment

Simply push this repository to GitHub and enable **GitHub Pages** in the repository settings.

---
**Version**: 1.0.0
**License**: MIT
