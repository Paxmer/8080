# Estado del tutorial Intel 8080

## Objetivo

Aprender a usar el simulador Intel 8080 del repositorio mediante ejercicios progresivos, ejecutando codigo paso a paso y observando registros, memoria y banderas.

El objetivo pedagogico es doble: primero el usuario debe entender cada concepto con claridad, y despues debe poder explicarlo a sus alumnos de forma simple, usando ejemplos paso a paso.

## Forma de trabajo

1. El asistente propone un programa corto sin comentarios para pegar en el simulador.
2. El usuario lo ejecuta con Assemble & Load.
3. El usuario avanza con Step y hace preguntas sobre lo que observa.
4. Se explica el efecto de cada instruccion sobre registros, memoria, PC, SP y banderas.
5. Al terminar un ejercicio, se propone una variante un poco mas dificil.

## Simulador

- Archivo principal: `index.html`.
- Manual leido: `INSTRUCTIONS.md`.
- Boton para cargar codigo: `Assemble & Load`.
- Boton para ejecutar paso a paso: `Step`.
- Boton para ejecutar continuo: `Run`.
- Boton para detener ejecucion continua: `Stop`.
- Boton para reiniciar CPU: `Reset`.
- Visor de memoria: campo de direccion hexadecimal y boton `Go`.

## Primer ejercicio

Tema: suma simple con registros y almacenamiento en memoria.

Programa base:

```asm
MVI A, 5
MVI B, 10
ADD B
STA 200H
HLT
```

Resultado esperado:

- `A` termina con `0F` hexadecimal, que equivale a 15 decimal.
- `B` queda con `0A` hexadecimal, que equivale a 10 decimal.
- La memoria en `0200H` queda con `0F`.
- El programa termina en estado `Halted`.

## Observaciones importantes

- La instruccion correcta para detener el procesador es `HLT`, no `HTL`.
- Los registros de 8 bits principales son `A`, `B`, `C`, `D`, `E`, `H`, `L`.
- `A` es el acumulador: muchas operaciones aritmeticas guardan ahi su resultado.
- `STA dir16` guarda el contenido de `A` en una direccion de memoria.
- Las banderas visibles son `S`, `Z`, `AC`, `P`, `CY`.

## Progresion sugerida

1. Suma: `MVI`, `ADD`, `STA`, `HLT`.
2. Resta: `SUB` y banderas cuando el resultado es cero o negativo en 8 bits.
3. Inmediatos: `ADI` y `SUI`.
4. Memoria: `LDA`, `STA`, `LXI HL`, `MOV M,A`, `MOV A,M`.
5. Banderas y comparacion: `CMP`, `CPI`, `JZ`, `JNZ`, `JC`, `JNC`.
6. Bucles: contadores con `DCR`/`INR` y saltos condicionales.
7. Subrutinas y pila: `CALL`, `RET`, `PUSH`, `POP`, `SP`.

## Siguiente paso

El usuario ejecutara el primer ejercicio y hara preguntas sobre los cambios observados en cada Step.

## Preguntas vistas en el primer ejercicio

- Despues de `Assemble & Load`, el codigo queda cargado en memoria, pero aun no se ejecuta.
- Los registros se muestran en hexadecimal en la interfaz. Por eso decimal 10 aparece como `0A`.
- `Step` ejecuta la instruccion apuntada por `PC`. El visor de memoria resalta la direccion actual de `PC`.
- `STA 200H` no imprime en pantalla; guarda el contenido de `A` en memoria en la direccion `0200H`.
- `200H` y `0200H` son la misma direccion; el visor la muestra con 4 digitos.
- En el primer ejercicio, despues de la suma, `A = 0F` y memoria `0200H = 0F`.
- La bandera `P` se activa si el resultado tiene paridad par, es decir, cantidad par de bits en 1.

## Dudas nuevas para reforzar

- Por que en ensamblador se suele escribir en hexadecimal en vez de binario.
- Para que sirve la bandera de paridad `P`.
- Por que se guarda el valor de `A` en `200H`.
- Diferencia entre CPU de 8 bits y direcciones de memoria de 16 bits.
- Entender que `ADD B` significa `A = A + B` y que `A` conserva el valor anterior antes de la suma.

## Segundo ejercicio

Tema: otra suma y observacion de bandera `AC`.

Programa usado:

```asm
MVI A, 20
MVI B, 15
ADD B
STA 201H
HLT
```

Resultado esperado:

- `20` decimal aparece como `14H` en registros.
- `15` decimal aparece como `0FH` en registros.
- La suma decimal es `35`.
- `35` decimal aparece como `23H`.
- El resultado se guarda en `0201H`.
- `AC` puede encenderse porque hubo acarreo desde el nibble bajo: `4H + FH = 13H`.

## Siguiente ejercicio propuesto

Tema: resta usando etiqueta para marcar el inicio del programa.

## Dudas posteriores sobre resta

- Reforzar diferencia entre `CY` y `AC`.
- En resta, `CY = 1` significa que hubo prestamo porque `A` era menor que el valor restado.
- En resta, `AC = 1` puede indicar prestamo entre los 4 bits bajos y altos del byte.
- Aclarar diferencia entre numeros decimales sin sufijo y hexadecimales con `H`.
- Si se usa `STA 202H`, revisar memoria como `0202H` y asegurarse de haber ejecutado esa instruccion.
- Idea futura: proyecto con Arduino para ingresar valores y mostrar resultado binario/hexadecimal en LEDs.

## Lectura de la interfaz

- Los registros `A`, `B`, `C`, `D`, `E`, `H`, `L` son registros internos de 8 bits, no son cache.
- `A` es el acumulador: muchas operaciones dejan ahi el resultado.
- `PC` es el Program Counter: apunta a la direccion de memoria de la siguiente instruccion.
- `PC` no siempre sube de 1 en 1 porque las instrucciones tienen tamanos distintos: `MVI` ocupa 2 bytes, `SUB` ocupa 1 byte, `STA` ocupa 3 bytes, `HLT` ocupa 1 byte.
- `SP` es el Stack Pointer: apunta a la pila. Al reiniciar suele empezar en `FFFFH`.
- `Flags` es el registro empaquetado de banderas; la interfaz tambien muestra banderas individuales como `S`, `Z`, `AC`, `P`, `CY`.
- `F1H` no es error en una resta como `10 - 25`; es el resultado en 8 bits despues de desbordamiento/préstamo. Tambien puede leerse como 241 sin signo o como -15 en complemento a dos.
- El codigo `STA 202H` guarda en `0202H`, no en `0200H`.
- Los registros de 8 bits pueden interpretarse sin signo como `0..255` o con signo como `-128..127`.
- Un valor decimal como `2400` no cabe en un registro de 8 bits; si se carga con `MVI`, queda truncado al byte bajo (`2400 decimal = 0960H`, byte bajo `60H`).
- El 8080 tiene operaciones de 16 bits limitadas con pares de registros, por ejemplo `LXI`, `INX`, `DCX` y `DAD`.

## Proximo ejercicio con etiquetas

Tema: suma/resta con etiquetas `INICIO` y `FIN`.

Programa propuesto:

```asm
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
- `JMP FIN` salta a la etiqueta `FIN`, donde esta `HLT`.

## Cambios de documentacion

- Se agrego a `INSTRUCTIONS.md` una seccion de rangos de 8 bits: sin signo `0..255`, con signo `-128..+127`.
- Se documento que `MVI A, 2400` no cabe completo en 8 bits; `2400 decimal = 0960H`, por lo que se conserva el byte bajo `60H`.
- Se agrego una nota breve equivalente en `README.md`.
- Se agrego a `INSTRUCTIONS.md` una seccion `Tutorial Progresivo de Aritmetica` con tabla de conceptos, tabla de operaciones y ejemplos: Hola Mundo, suma, resta positiva, resta negativa, multiplicacion, division y exponente.

## Correcciones didacticas importantes

- La instruccion para incrementar es `INR`, no `ICR`.
- La instruccion para decrementar es `DCR`.
- `ADD B` significa `A = A + B`.
- `SUB B` significa `A = A - B`.
- El CPU no guarda valores como texto positivo o negativo; guarda patrones de 8 bits.
- Un byte como `F1H` puede interpretarse sin signo como `241`, o con signo como `-15`.
- `S = 1` significa que el bit mas alto esta encendido; si se interpreta con signo, eso indica negativo.
- En resta, `CY = 1` significa prestamo. Es clave para explicar cuando `A < B` en aritmetica sin signo.

## Operaciones trabajadas o solicitadas

| Operacion | Metodo en Intel 8080 | Estado pedagogico |
| --- | --- | --- |
| Suma | `ADD`, `ADI` | Ya practicada con `MVI`, `ADD`, `STA`, `HLT`. |
| Resta positiva | `SUB`, `SUI` | Ya practicada; reforzar lectura de resultado y memoria. |
| Resta negativa | `SUB` con prestamo | Ya explicada con `10 - 25 = F1H = -15 con signo`. |
| Multiplicacion | Sumas repetidas | Ya propuesta con `5 * 3`. |
| Division | Restas repetidas | Ya propuesta con `15 / 3`. |
| Exponente | Multiplicaciones repetidas | Solicitada; documentada con `2^3`. Debe explicarse despues de entender bucles. |
| AND | Operacion logica bit a bit | Documentada con `ANA`/`ANI`; ejemplo `0FH AND 03H = 03H`. |
| OR | Operacion logica bit a bit | Documentada con `ORA`/`ORI`; ejemplo `0CH OR 03H = 0FH`. |
| XOR | Operacion logica bit a bit | Documentada con `XRA`/`XRI`; ejemplo `0FH XOR 03H = 0CH`. |
| NOT | Inversion de bits | Documentada con `CMA`; ejemplo `NOT 0FH = F0H`. |

## Ejercicio de multiplicacion documentado

```asm
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

Resultado: `5 * 3 = 15`, por tanto `A = 0FH` y memoria `0204H = 0FH`.

## Ejercicio de division documentado

```asm
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

Resultado: `15 / 3 = 5`, por tanto memoria `0205H = 05H`. `C` cuenta el cociente.

## Ejercicio de exponente documentado

```asm
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

Resultado: `2^3 = 8`, por tanto `A = 08H` y memoria `0206H = 08H`. Este ejemplo asume exponente positivo.

## Proxima sesion sugerida

Continuar con explicacion lenta de bucles antes de potencia: primero `DCR C` + `JNZ BUCLE`, luego multiplicacion, luego division, y solo despues exponente. El usuario quiere entenderlo bien para poder explicarlo a alumnos.

## Aclaracion pedagogica del usuario

- Cuando el usuario dice "de lo general a lo especifico", quiere decir que al alumno se le presenta primero la operacion humana conocida, no el mnemonico del 8080.
- Ejemplo correcto de enfoque: "vamos a aprender a sumar en el 8080", no "vamos a aprender `ADD`".
- La explicacion debe partir de problemas familiares: sumar, restar, saber si un numero es menor, repetir, multiplicar, dividir, elevar.
- Despues se traduce esa idea a registros, acumulador, memoria, banderas e instrucciones.
- Comparacion debe explicarse como la base de preguntas tipo `if`: igual, distinto, menor, mayor o fin de ciclo.
- Comparacion no es lo mismo que `AND`, `OR`, `XOR`, `NOT`; esas son operaciones logicas bit a bit. Se pueden relacionar con logica booleana, pero en el 8080 operan sobre bits de un byte.
- Se actualizo `INSTRUCTIONS.md` para que la tabla principal diga primero "lo que entiende el alumno" y despues "como se hace en el 8080".

## Operaciones logicas aclaradas

- El usuario pregunto directamente si ademas de `OR` se puede hacer `AND` y `XOR`.
- Respuesta: si, el 8080 puede hacer `AND`, `OR`, `XOR` y `NOT`.
- Equivalencias: `AND -> ANA/ANI`, `OR -> ORA/ORI`, `XOR -> XRA/XRI`, `NOT -> CMA`.
- Se agrego a `INSTRUCTIONS.md` una seccion `Operaciones Logicas Bit a Bit` con tabla y ejemplos ejecutables.
