# Guía de Uso del Emulador y Ensamblador Intel 8080

¡Bienvenido al emulador y ensamblador interactivo de Intel 8080 de alto rendimiento! Este proyecto está construido con tecnología 100% pura y limpia (HTML, CSS y JavaScript modernos) sin frameworks ni dependencias de terceros, lo que lo hace ideal para el aprendizaje académico y la experimentación de sistemas de bajo nivel.

---

## Índice

1. [Instrucciones de Uso de la Interfaz Web](#1-instrucciones-de-uso-de-la-interfaz-web)
2. [El Ensamblador y sus Directivas](#2-el-ensamblador-y-sus-directivas)
3. [Guía de Referencia de Instrucciones Básicas (Set de Instrucciones)](#3-guía-de-referencia-de-instrucciones-básicas-set-de-instrucciones)
4. [Ejemplo Clásico: Programa "Hola Mundo" (Hello World)](#4-ejemplo-clásico-programa-hola-mundo-hello-world)
5. [Otros Ejemplos Prácticos](#5-otros-ejemplos-prácticos)
6. [Tutorial Progresivo de Aritmética](#6-tutorial-progresivo-de-aritmética)

---

## 1. Instrucciones de Uso de la Interfaz Web

La pantalla principal se divide en dos secciones principales:
- **Ensamblador (Panel Izquierdo):** El editor de código donde escribes tus programas en lenguaje ensamblador de Intel 8080.
- **Cuadro de Mando del CPU y Memoria (Panel Derecho):** Muestra el estado del CPU en tiempo real, incluyendo registros, banderas de estado (`S`, `Z`, `AC`, `P`, `CY`) y un visor interactivo de memoria.

### Controles Principales:
- **Assemble & Load:** Toma el código escrito en el editor, lo compila a código binario de máquina (opcodes) en tiempo real, y lo carga en la memoria del CPU (empezando en la dirección especificada por `ORG` o por defecto en `0000H`).
- **Run:** Ejecuta el programa de forma continua a alta velocidad.
- **Stop:** Detiene o pausa la ejecución continua para permitirte inspeccionar el estado actual de los registros y la memoria.
- **Step:** Ejecuta una sola instrucción (paso a paso), ideal para depurar (debugging) y ver el efecto exacto de cada línea en los registros.
- **Reset:** Reinicia todos los registros a `00`, pone el program counter (`PC`) en `0000H` y restaura el puntero de pila (`SP`) a `FFFFH`.
- **Memory View (Visor de Memoria):** Te permite ingresar una dirección hexadecimal (por ejemplo, `2000`) y presionar **Go** para visualizar un mapa de memoria en tiempo real de 128 bytes contiguos a partir de esa dirección. El indicador amarillo resalta la posición actual del Program Counter (`PC`).

---

## 2. El Ensamblador y sus Directivas

El ensamblador de este emulador traduce el código mnemónico a código de máquina hexadecimal. Soporta las siguientes características:

- **Etiquetas (Labels):** Permiten marcar posiciones en la memoria para saltos y llamadas. Deben finalizar con dos puntos (`:`).
  ```assembly
  INICIO: MVI A, 05H
          JMP INICIO
  ```
- **Comentarios:** Cualquier texto que comience con un punto y coma (`;`) es ignorado por el compilador.
  ```assembly
  ADD B ; Esto es un comentario
  ```
- **Constantes Numéricas:**
  - **Hexadecimal:** Soportado con sufijo `H` / `h` (ej. `12H`, `FFh`) o prefijo `0x` / `0X` (ej. `0x12`, `0xFF`).
  - **Decimal:** Números sin prefijos ni sufijos (ej. `10`, `255`).

### Rango de Valores de 8 bits

El Intel 8080 es un procesador de 8 bits para sus registros principales (`A`, `B`, `C`, `D`, `E`, `H`, `L`). Eso significa que cada uno de esos registros solo puede almacenar un byte, es decir, valores entre `00H` y `FFH`.

Ese mismo byte puede interpretarse de dos formas comunes:

- **Sin signo:** `0` a `255` decimal (`00H` a `FFH`).
- **Con signo:** `-128` a `+127` decimal, usando complemento a dos.

Por ejemplo, el byte `F1H` puede leerse como `241` si se interpreta sin signo, o como `-15` si se interpreta con signo. El CPU no guarda la palabra "positivo" o "negativo"; solo guarda bits. La interpretación depende del programa y del contexto.

Si una instrucción de 8 bits recibe un valor mayor que `255`, no cabe completo en un registro de 8 bits. Por ejemplo, `2400` decimal equivale a `0960H`. En una carga inmediata de 8 bits como `MVI A, 2400`, este emulador conserva solo el byte bajo (`60H`) porque `MVI` carga únicamente 8 bits. Para trabajar con valores de 16 bits se usan pares de registros e instrucciones específicas, como `LXI`, `INX`, `DCX` y `DAD`.

### Directivas Soportadas:
1. **`ORG <dirección>` (Origin):** Establece la dirección inicial del Program Counter donde se cargará el programa siguiente.
   ```assembly
   ORG 1000H ; Las siguientes instrucciones se cargarán a partir de la dirección 1000H
   ```
2. **`DB <byte1>, <byte2>, ...` (Define Byte):** Inserta valores de bytes constantes directamente en la memoria.
   ```assembly
   DATOS: DB 01H, 02H, 03H, 10
   ```

---

## 3. Guía de Referencia de Instrucciones Básicas (Set de Instrucciones)

A continuación, se describen los comandos e instrucciones básicas más importantes del Intel 8080 clasificados por categoría.

### A. Transferencia de Datos
- **`MOV R1, R2`**: Copia el valor del registro `R2` al registro `R1`. Los registros válidos son `A`, `B`, `C`, `D`, `E`, `H`, `L` y `M` (que apunta al byte de memoria referenciado por la pareja `H:L`).
  - *Ejemplo:* `MOV A, B` (Copia el contenido de B a A).
- **`MVI R, dato`**: Carga un valor de 8 bits (inmediato) al registro `R`.
  - *Ejemplo:* `MVI C, 3FH` (Carga el byte `3F` en el registro C).
- **`LXI RP, dato16`**: Carga un valor inmediato de 16 bits en la pareja de registros `RP` (`BC`, `DE`, `HL` o `SP`).
  - *Ejemplo:* `LXI HL, 2000H` (Carga la dirección `2000H` en los registros H e L).
- **`LDA dir16`**: Carga el contenido de la dirección de memoria especificada al acumulador (registro `A`).
  - *Ejemplo:* `LDA 2500H` (Lee el byte de la dirección 2500H y lo guarda en A).
- **`STA dir16`**: Guarda el contenido del acumulador en la dirección de memoria especificada.
  - *Ejemplo:* `STA 2000H` (Guarda el valor de A en la memoria en la posición 2000H).

### B. Instrucciones Aritméticas y Lógicas
- **`ADD R`**: Suma el valor del registro `R` al acumulador `A`. Afecta las banderas de estado.
- **`ADI dato`**: Suma un valor inmediato de 8 bits al acumulador.
- **`SUB R`**: Resta el valor del registro `R` del acumulador `A`.
- **`SUI dato`**: Resta un valor inmediato del acumulador.
- **`INR R`**: Incrementa el valor del registro `R` por 1.
- **`DCR R`**: Decrementa el valor del registro `R` por 1.
- **`ANA R` / `ANI dato`**: Realiza una operación lógica AND entre el registro/dato y el acumulador.
- **`ORA R` / `ORI dato`**: Realiza una operación lógica OR entre el registro/dato y el acumulador.
- **`XRA R` / `XRI dato`**: Realiza una operación lógica XOR (OR Exclusiva) entre el registro/dato y el acumulador (útil para vaciar el acumulador usando `XRA A`).
- **`CMP R` / `CPI dato`**: Compara el registro o dato con el acumulador restándolo temporalmente (sin guardar el resultado en A). Afecta a las banderas. Si `A == dato`, se activa la bandera de Cero (`Z`). Si `A < dato`, se activa la bandera de Acarreo/Préstamo (`CY`).

### C. Control de Flujo (Saltos y Subrutinas)
- **`JMP etiqueta`**: Salto incondicional a la dirección de la etiqueta.
- **`JZ etiqueta`** / **`JNZ etiqueta`**: Salta si la bandera de Cero está activa (JZ) o inactiva (JNZ).
- **`JC etiqueta`** / **`JNC etiqueta`**: Salta si hay acarreo (JC) o no lo hay (JNC).
- **`CALL etiqueta`**: Llama a una subrutina guardando la dirección actual (`PC`) en la pila (`Stack`).
- **`RET`**: Retorna de una subrutina sacando la dirección de retorno de la pila.
- **`HLT`**: Detiene (Halt) la ejecución del CPU de forma definitiva hasta que se haga un reinicio.

---

## 4. Ejemplo Clásico: Programa "Hola Mundo" (Hello World)

En la programación tradicional de microprocesadores antiguos, no existe un terminal gráfico directo "printf". En su lugar, el concepto de "Hola Mundo" se demuestra escribiendo una cadena de caracteres codificada en ASCII dentro de una zona específica de la memoria (por ejemplo, a partir de `2000H`), o bien, enviando los caracteres uno a uno.

Este ejemplo carga la dirección inicial en el puntero `HL`, lee carácter por carácter en un ciclo, los guarda secuencialmente a partir de la memoria `2000H` (actuando como el búfer de pantalla de salida), y se detiene al encontrar un carácter terminador `00H` (nulo).

### Código para copiar y pegar en el editor:

```assembly
; PROGRAMA HOLA MUNDO (HELLO WORLD) PARA EL INTEL 8080
; Este programa copia una cadena ASCII desde la memoria de código
; a un búfer simulado de salida en la dirección 2000H.

        ORG 0000H          ; El programa inicia en la dirección 0000H
        LXI HL, CADENA     ; HL apunta al inicio de nuestro texto
        LXI DE, 2000H      ; DE apunta al búfer de salida (pantalla simulada)

BUCLE:  MOV A, M           ; Lee el carácter actual apuntado por HL a A
        CPI 0              ; ¿Es el carácter terminador nulo (0)?
        JZ FIN             ; Si es 0, hemos terminado y saltamos a FIN

        STAX DE            ; Guarda el carácter en el búfer de salida apuntado por DE
        INX HL             ; Avanza HL al siguiente carácter de la cadena
        INX DE             ; Avanza DE en el búfer de salida
        JMP BUCLE          ; Repite el proceso

FIN:    HLT                ; Detiene la ejecución de la CPU

; Declaración de datos de la cadena de caracteres en ASCII
CADENA: DB 48H, 45H, 4CH, 4CH, 4FH, 20H, 4DH, 55H, 4EH, 44H, 4FH, 21H, 00H
; Representa "HELLO MUNDO!" seguido de un terminador nulo (00H).
; Códigos ASCII Hex:
; 48H = 'H'  45H = 'E'  4CH = 'L'  4CH = 'L'  4FH = 'O'  20H = ' '
; 4DH = 'M'  55H = 'U'  4EH = 'N'  44H = 'D'  4FH = 'O'  21H = '!'
; 00H = Nulo
```

### Cómo probarlo:
1. Copia el código anterior.
2. Pégalo en el cuadro de texto del **Assembler** en el navegador.
3. Haz clic en **Assemble & Load**. Verás el mensaje "Assembly successful!".
4. En el módulo **Memory View** (abajo a la derecha), ingresa `2000` en el campo de texto y haz clic en **Go**. Verás que todas las casillas de la memoria a partir de `2000` están actualmente vacías (`00`).
5. Haz clic en **Run** (o presiona **Step** repetidamente para ver paso a paso cómo se llena).
6. Una vez que el CPU cambie su estado a **Halted** en color rojo, revisa la memoria desde la dirección `2000`. Verás lo siguiente:
   - `2000`: `48` ('H')
   - `2001`: `45` ('E')
   - `2002`: `4C` ('L')
   - `2003`: `4C` ('L')
   - `2004`: `4F` ('O')
   - `2005`: `20` (' ')
   - `2006`: `4D` ('M')
   - `2007`: `55` ('U')
   - `2008`: `4E` ('N')
   - `2009`: `44` ('D')
   - `200A`: `4F` ('O')
   - `200B`: `21` ('!')
7. ¡Felicidades! Has completado exitosamente la ejecución de tu primer programa interactivo en Intel 8080.

---

## 5. Otros Ejemplos Prácticos

### A. Suma de Dos Números con Almacenamiento en Memoria
Suma de dos constantes y guarda el resultado en la posición `3000H`.

```assembly
MVI A, 0AH   ; Carga 10 (decimal) en el Acumulador A
MVI B, 14H   ; Carga 20 (decimal, 14H) en el Registro B
ADD B        ; A = A + B (Resultado 30 / 1EH se almacena en A)
STA 3000H    ; Almacena el resultado (1EH) en la dirección 3000H
HLT          ; Detiene la ejecución
```

### B. Ciclo de Conteo Descendente (Countdown Loop)
Este programa escribe valores de un temporizador decreciente (`10` a `1`) en memoria desde `1500H`.

```assembly
        LXI HL, 1500H ; HL apunta a la memoria de destino
        MVI B, 10     ; B será nuestro contador inicializado en 10

BUCLE:  MOV A, B      ; Cargamos el valor de conteo en A
        MOV M, A      ; Lo guardamos en la posición apuntada por HL
        INX HL        ; Incrementamos la dirección de memoria de destino
        DCR B         ; Decrementamos nuestro contador B
        JNZ BUCLE     ; Si el contador B no ha llegado a cero, repetimos

        HLT           ; Detiene el CPU al finalizar el conteo
```

---

## 6. Tutorial Progresivo de Aritmética

Esta sección resume una ruta de aprendizaje recomendada para practicar con estudiantes. La idea es ejecutar cada programa con **Assemble & Load** y luego avanzar con **Step**, observando registros, memoria, `PC` y banderas.

### Conceptos Base

| Concepto | Significado |
| --- | --- |
| `A` | Acumulador. Muchas operaciones aritméticas guardan el resultado aquí. |
| `B`, `C`, `D`, `E`, `H`, `L` | Registros auxiliares de 8 bits. |
| `PC` | Program Counter. Apunta a la próxima instrucción en memoria. |
| `SP` | Stack Pointer. Apunta a la pila. |
| `STA dir16` | Guarda el contenido de `A` en una dirección de memoria. |
| `HLT` | Detiene el CPU. |
| `INR R` | Incrementa un registro en 1. No existe `ICR`; la instrucción correcta es `INR`. |
| `DCR R` | Decrementa un registro en 1. |

### Operaciones Generales para Enseñar

Para una clase conviene presentar primero la idea conocida por el estudiante y después mostrar cómo se expresa en el Intel 8080. No se empieza diciendo "vamos a ver `ADD`"; se empieza diciendo "vamos a sumar en el 8080".

| Lo que entiende el alumno | Pregunta o problema | Cómo se hace en el 8080 | Instrucciones relacionadas |
| --- | --- | --- | --- |
| Sumar | ¿Cuánto da `A + B`? | Se carga un valor en `A`, otro en un registro, y se suma contra el acumulador. | `MVI`, `ADD`, `ADI` |
| Restar | ¿Cuánto da `A - B`? | Se carga el minuendo en `A`, el sustraendo en otro registro, y se resta contra `A`. | `MVI`, `SUB`, `SUI` |
| Saber si una resta dio negativa | ¿El primer número era menor que el segundo? | Se observa `CY`. En resta, `CY = 1` significa préstamo. | `SUB`, `CMP`, `JC` |
| Comparar | ¿Son iguales? ¿Cuál es menor? | El CPU hace una resta interna sin guardar el resultado y solo cambia banderas. | `CMP`, `CPI`, `JZ`, `JNZ`, `JC`, `JNC` |
| Tomar decisiones | Si pasa algo, ir a una parte; si no, seguir. | Se usan banderas como condiciones para saltar. Es la base de un `if`. | `JZ`, `JNZ`, `JC`, `JNC`, `JMP` |
| Repetir | Hacer algo varias veces. | Se usa un contador que sube o baja y un salto condicional. Es la base de un ciclo. | `INR`, `DCR`, `JNZ`, `JMP` |
| Multiplicar | Sumar el mismo número varias veces. | No existe `MUL`; se construye con sumas repetidas y un contador. | `ADD`, `DCR`, `JNZ` |
| Dividir | Restar el mismo número varias veces. | No existe `DIV`; se construye con restas repetidas y un contador de cociente. | `SUB`, `INR`, `JC`, `JMP` |
| Elevar a potencia | Multiplicar varias veces. | No existe potencia; se construye con multiplicaciones repetidas. | Bucles con `ADD`, `DCR`, `JNZ` |
| Trabajar con bits | Encender, apagar, combinar o invertir bits. | Se usan operaciones lógicas bit a bit. Son parecidas a condiciones booleanas, pero aplicadas a cada bit del byte. | `ANA`, `ORA`, `XRA`, `CMA` |
| Trabajar con valores de 16 bits | Usar direcciones o valores mayores a un byte. | Se usan pares de registros como `HL`, `BC` o `DE`. | `LXI`, `INX`, `DCX`, `DAD` |

Comparar no es exactamente lo mismo que `AND`, `OR`, `XOR` o `NOT`. Comparar sirve para preguntar igualdad o orden usando banderas. Las operaciones lógicas sirven para manipular bits: `ANA` es AND, `ORA` es OR, `XRA` es XOR y `CMA` es NOT del acumulador.

### Operaciones Lógicas Bit a Bit

Estas operaciones no preguntan si un número es mayor o menor. Trabajan bit por bit dentro de un byte. Son útiles para encender bits, apagar bits, invertir bits o detectar patrones.

| Operación lógica | Nombre común | Instrucciones 8080 | Idea |
| --- | --- | --- | --- |
| AND | Y lógico | `ANA R`, `ANI dato` | Un bit queda en `1` solo si ambos bits son `1`. |
| OR | O lógico | `ORA R`, `ORI dato` | Un bit queda en `1` si cualquiera de los dos bits es `1`. |
| XOR | O exclusivo | `XRA R`, `XRI dato` | Un bit queda en `1` si los bits son diferentes. |
| NOT | Negación/inversión | `CMA` | Invierte todos los bits de `A`. |

Ejemplo de AND:

```assembly
INICIO:
MVI A, 0FH
MVI B, 03H
ANA B
STA 210H
HLT
```

Resultado esperado:

- `0FH = 00001111`.
- `03H = 00000011`.
- `0FH AND 03H = 03H`.
- Memoria `0210H = 03H`.

Ejemplo de OR:

```assembly
INICIO:
MVI A, 0CH
MVI B, 03H
ORA B
STA 211H
HLT
```

Resultado esperado:

- `0CH = 00001100`.
- `03H = 00000011`.
- `0CH OR 03H = 0FH`.
- Memoria `0211H = 0FH`.

Ejemplo de XOR:

```assembly
INICIO:
MVI A, 0FH
MVI B, 03H
XRA B
STA 212H
HLT
```

Resultado esperado:

- `0FH = 00001111`.
- `03H = 00000011`.
- `0FH XOR 03H = 0CH`.
- Memoria `0212H = 0CH`.

Ejemplo de NOT:

```assembly
INICIO:
MVI A, 0FH
CMA
STA 213H
HLT
```

Resultado esperado:

- `0FH = 00001111`.
- `CMA` invierte todos los bits de `A`.
- Resultado: `F0H = 11110000`.
- Memoria `0213H = F0H`.

### Hola Mundo

El ejemplo de "Hola Mundo" no imprime en una pantalla real. Copia bytes ASCII a memoria, normalmente desde una cadena hacia una zona como `2000H`. Sirve para explicar que memoria puede contener código, datos y buffers.

### Suma Básica

```assembly
MVI A, 5
MVI B, 10
ADD B
STA 200H
HLT
```

Resultado esperado:

- `A = 0FH`, que equivale a `15` decimal.
- `B = 0AH`, que equivale a `10` decimal.
- Memoria `0200H = 0FH`.
- `ADD B` significa `A = A + B`.

### Resta con Resultado Positivo y Etiquetas

```assembly
INICIO:
MVI A, 40
MVI B, 15
SUB B
STA 203H
JMP FIN

FIN:
HLT
```

Resultado esperado:

- `40 - 15 = 25` decimal.
- `25` decimal aparece como `19H`.
- `A = 19H`.
- Memoria `0203H = 19H`.

### Resta con Resultado Negativo

```assembly
INICIO:
MVI A, 10
MVI B, 25
SUB B
STA 202H
HLT
```

Resultado esperado:

- Matemáticamente, `10 - 25 = -15`.
- En 8 bits, el patrón guardado es `F1H`.
- `F1H` puede leerse como `241` sin signo o como `-15` con signo.
- `CY = 1` indica que hubo préstamo en la resta.
- `S = 1` indica que el bit más alto del resultado está encendido.

### Multiplicación por Sumas Repetidas

El Intel 8080 no tiene instrucción `MUL`. Para multiplicar se suma repetidamente.

Ejemplo: `5 * 3`.

```assembly
INICIO:
MVI A, 0
MVI B, 5
MVI C, 3

BUCLE:
ADD B
DCR C
JNZ BUCLE

STA 204H

FIN:
HLT
```

Resultado esperado:

- `A = 0FH`, que equivale a `15` decimal.
- Memoria `0204H = 0FH`.
- `C` funciona como contador de repeticiones.

### División por Restas Repetidas

El Intel 8080 no tiene instrucción `DIV`. Para dividir se resta repetidamente y se cuenta cuántas veces fue posible restar.

Ejemplo: `15 / 3`.

```assembly
INICIO:
MVI A, 15
MVI B, 3
MVI C, 0

BUCLE:
SUB B
JC FIN
INR C
JMP BUCLE

FIN:
MOV A, C
STA 205H
HLT
```

Resultado esperado:

- `C = 05H`, porque `15 / 3 = 5`.
- Al final se copia `C` hacia `A` con `MOV A, C`.
- Memoria `0205H = 05H`.
- `CY = 1` aparece cuando la última resta ya no se puede hacer sin préstamo.

### Exponente por Multiplicaciones Repetidas

El Intel 8080 tampoco tiene una instrucción de potencia. Una potencia se puede resolver repitiendo multiplicaciones, y cada multiplicación se puede resolver con sumas repetidas.

Ejemplo: `2^3`.

```assembly
INICIO:
MVI A, 1
MVI B, 2
MVI D, 3

POTENCIA:
MOV E, A
MVI A, 0
MOV C, B

MULT:
ADD E
DCR C
JNZ MULT
DCR D
JNZ POTENCIA

STA 206H

FIN:
HLT
```

Resultado esperado:

- `2^3 = 8` decimal.
- `A = 08H`.
- Memoria `0206H = 08H`.
- `B` guarda la base.
- `D` cuenta cuántas multiplicaciones faltan.
- `C` cuenta las sumas internas de cada multiplicación.
- `E` guarda temporalmente el resultado anterior.

Este ejemplo es didáctico y asume exponentes positivos. Para enseñar, conviene primero dominar suma, resta, contadores y saltos antes de explicar potencia.
