export interface Answer { explanation: string; concepts: string[]; formula: string; example: string; revision: string; questions: string[] }

const T = (keys: string[], explanation: string, concepts: string[], formula: string, example: string, revision: string, questions: string[]) =>
  ({ keys, a: { explanation, concepts, formula, example, revision, questions } });

const TOPICS = [
  T(["ohm"], "Ohm's Law says the current through a conductor is proportional to the voltage across it.", ["Voltage (V)", "Current (I)", "Resistance (R)"], "V = I × R", "A 12 V battery across a 4 Ω resistor gives I = 12 / 4 = 3 A.", "Voltage pushes, resistance resists, current flows. V = IR.", ["Find I when V = 9 V and R = 3 Ω.", "What happens to current if R doubles at fixed V?", "A 5 A current flows through 20 Ω. Find V."]),
  T(["kirchhoff", "kcl", "kvl"], "Kirchhoff's Laws describe how current and voltage behave in circuits: current in equals current out at a node, and voltages around a loop sum to zero.", ["KCL: node currents", "KVL: loop voltages", "Nodal and mesh analysis"], "ΣI(in) = ΣI(out);  ΣV(loop) = 0", "Two branches carry 2 A and 3 A into a node, so 5 A leaves it.", "KCL = current conservation. KVL = energy conservation.", ["Three currents of 1 A, 2 A, 4 A: find the fourth at a node.", "Write KVL for a loop with a 10 V source and two resistors.", "Why does KCL hold?"]),
  T(["plc"], "A PLC is a rugged industrial computer that reads inputs, runs a control program, and drives outputs.", ["Scan cycle", "Ladder logic", "I/O modules"], "Scan: Read Inputs → Execute Program → Write Outputs", "A start button latches a motor contactor in ladder logic, and a stop button breaks the rung.", "PLC = scan cycle + ladder logic + rugged I/O.", ["List the three steps of a PLC scan.", "Draw a start/stop latch rung.", "Why use a PLC instead of relays?"]),
  T(["pid"], "A PID controller corrects error between a setpoint and a measurement using proportional, integral and derivative terms.", ["Proportional: present error", "Integral: past error", "Derivative: future trend"], "u(t) = Kp·e + Ki·∫e dt + Kd·de/dt", "Holding a tank at 50 °C: P reacts to the gap, I removes the steady offset, D reduces overshoot.", "P = now, I = history, D = prediction.", ["What does the I term remove?", "What happens if Kd is too high?", "Why is PID so common in industry?"]),
  T(["mqtt"], "MQTT is a lightweight publish/subscribe protocol that moves small messages between IoT devices through a broker.", ["Broker", "Topics", "QoS 0, 1, 2"], "Topic example: factory/line1/temperature", "A sensor publishes 27.5 to factory/line1/temperature, and a dashboard subscribed to it displays it.", "Publish to topics, subscribe to topics, the broker routes.", ["What does a broker do?", "Which QoS guarantees exactly-once delivery?", "Design a topic for a motor current sensor."]),
  T(["arduino"], "Arduino is a beginner-friendly microcontroller platform for reading sensors and controlling devices.", ["setup() and loop()", "Digital and analog pins", "PWM"], "analogWrite(pin, 0-255)", "Blink an LED: pinMode(13, OUTPUT); digitalWrite(13, HIGH); delay(500);", "setup runs once, loop runs forever.", ["What does PWM do?", "Write code to read a sensor on A0.", "Difference between digitalRead and analogRead?"]),
  T(["raspberry", "pi "], "Raspberry Pi is a small Linux computer for projects needing networking, cameras, or AI.", ["GPIO pins", "Linux OS", "Python scripts"], "GPIO output: LED(17).on()", "Run a Python script that reads a temperature sensor and sends it over MQTT.", "Pi = tiny Linux computer with GPIO.", ["Pi vs Arduino: when to use each?", "What is GPIO?", "Name two uses of a Pi in automation."]),
  T(["digital logic", "logic gate", "boolean"], "Digital logic uses binary signals (0 and 1) and gates to make decisions.", ["AND, OR, NOT", "NAND/NOR universality", "Truth tables"], "Y = A·B + C", "An AND gate drives a motor only when both safety guards are closed.", "Gates combine bits; NAND can build everything.", ["Truth table of XOR.", "Simplify A·B + A·B'.", "Why is NAND universal?"]),
  T(["mosfet"], "A MOSFET is a voltage-controlled switch or amplifier, widely used in power circuits.", ["Gate, Drain, Source", "Threshold voltage Vth", "Rds(on) losses"], "P(loss) = I² × Rds(on)", "An N-MOSFET switches a 12 V fan from a 3.3 V microcontroller pin via a gate driver.", "Gate voltage controls the drain-source channel.", ["What is Vth?", "Compute loss for 5 A and 20 mΩ.", "Why add a gate resistor?"]),
  T(["transistor", "bjt"], "A transistor amplifies signals or acts as an electronic switch.", ["BJT: base, collector, emitter", "Cut-off, active, saturation", "Gain β"], "Ic = β × Ib", "A 1 mA base current with β = 100 controls a 100 mA relay coil.", "Small input current controls a large output current.", ["Find Ic for Ib = 2 mA, β = 150.", "When is a BJT in saturation?", "Why use a flyback diode with a relay?"]),
  T(["power electronics", "converter", "buck", "boost"], "Power electronics converts electrical power efficiently using switching devices.", ["AC-DC, DC-DC, DC-AC", "Switching and duty cycle", "Efficiency"], "Buck: Vout = D × Vin", "A buck converter with D = 0.5 turns 12 V into 6 V.", "Switch fast, filter smooth, waste little.", ["Vout for D = 0.25 and Vin = 24 V.", "Buck vs boost?", "Why are switching converters efficient?"]),
  T(["signal", "fourier", "laplace"], "Signals and Systems studies how signals are represented and how systems transform them.", ["Time vs frequency domain", "Convolution", "Fourier and Laplace"], "y(t) = x(t) * h(t)", "A low-pass filter removes high-frequency noise from a sensor signal.", "Output = input convolved with the impulse response.", ["What is an LTI system?", "Why use the Fourier transform?", "State the Nyquist rate."]),
  T(["python"], "Python is a readable language used for scripting, data analysis, automation and AI.", ["Variables and types", "Lists and dicts", "Functions and libraries"], "def f(x): return x * 2", "Read sensor values from a list and print the average with sum(v) / len(v).", "Readable, versatile, huge library ecosystem.", ["Write a function to compute power P = V·I.", "List vs dict?", "What does pip do?"]),
  T(["c++", "c/c", "embedded c", " c "], "C and C++ give low-level control and speed, which makes them the standard for embedded systems.", ["Pointers", "Memory and types", "Bitwise operations"], "PORTB |= (1 << 3);", "Set bit 3 of a port to turn on an LED on an AVR microcontroller.", "C = control close to hardware.", ["What is a pointer?", "Clear bit 2 of a register.", "Why use volatile in embedded C?"]),
  T(["industrial automation", "scada", "dcs", "iiot"], "Industrial automation uses controllers, sensors and networks to run processes with minimal human effort.", ["PLC, SCADA, DCS", "Sensors and actuators", "IIoT and Industry 4.0"], "Loop: Sense → Decide → Act", "A SCADA screen monitors tank levels while a PLC controls the pumps.", "Sense, control, supervise, optimize.", ["PLC vs DCS?", "What does SCADA do?", "Give one IIoT benefit."]),
];

export const EXAMPLES = ["Ohm's Law", "PLC", "PID Controller", "MQTT", "MOSFET", "Industrial Automation"];

export function demoAnswer(question: string, subject: string, level: string): Answer {
  const q = ` ${question.toLowerCase()} `;
  const hit = TOPICS.find((t) => t.keys.some((k) => q.includes(k)));
  if (hit) return hit.a;
  return {
    explanation: `"${question}" is a ${level.toLowerCase()}-level topic in ${subject}. Start with the core definition, then connect it to a real device or circuit.`,
    concepts: ["Definition and purpose", "Main components or variables", "Where it is used in practice"],
    formula: "Look for the governing equation, e.g. P = V × I for power.",
    example: `Pick one real system that uses "${question}" and trace the input, the processing and the output.`,
    revision: "Define it, name its parts, solve one example, then teach it to someone.",
    questions: [`Define "${question}" in two sentences.`, "Name one real-world application.", "What common mistake do beginners make with it?"],
  };
}

export async function askTutor(question: string, subject: string, level: string): Promise<Answer> {
  const key = import.meta.env.VITE_AI_API_KEY as string | undefined;
  await new Promise((r) => setTimeout(r, 900));
  if (key) {
    // TODO: call your AI provider here with `key`, then return the parsed Answer.
    // Until connected, fall through to demo mode.
  }
  return demoAnswer(question, subject, level);
}
