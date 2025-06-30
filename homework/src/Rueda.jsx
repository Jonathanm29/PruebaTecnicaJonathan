// src/RuedaConTarjetas.jsx
import React, { useRef, useState, useEffect} from "react";
import llantaImg from "./assets/llanta.png";
import "./RuedaConTarjetas.css";
import img1 from "./assets/021.jpg";

// datos de ejemplo: imagen y título
const cards = [
    { img: img1, title: "Bosque Privado" },
    { img: img1, title: "Paisaje Natural" },
    { img: img1, title: "Aventura 4×4" },
    { img: img1, title: "Relajación Total" },
    { img: img1, title: "Grupos Reducidos" },
    { img: img1, title: "Plan Familiar" },
];

export default function RuedaConTarjetas() {
    const wheelRef = useRef();
    const [rot, setRot] = useState(0);
    const dragging = useRef(false);
    const startAng = useRef(0);
    const lastRot = useRef(0);
    const [radio, setRadio] = useState(300); // radio inicial por defecto

    const n = cards.length;
    const angleStep = 360 / n;

    // Calcula el radio dinámicamente según el tamaño de la pantalla
    useEffect(() => {
        const updateRadio = () => {
            const r = 0.35 * Math.min(window.innerWidth, window.innerHeight);
            setRadio(r);
        };
        updateRadio();
        window.addEventListener("resize", updateRadio);
        return () => window.removeEventListener("resize", updateRadio);
    }, []);

    const getAngle = (x, y) => {
        const r = wheelRef.current.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
    };

    const onMouseDown = (e) => {
        e.preventDefault();
        dragging.current = true;
        startAng.current = getAngle(e.clientX, e.clientY) - lastRot.current;
    };

    const onMouseMove = (e) => {
        if (!dragging.current) return;
        const a = getAngle(e.clientX, e.clientY);
        setRot(a - startAng.current);
    };

    const onMouseUp = () => {
        if (!dragging.current) return;
        dragging.current = false;
        const snapped = Math.round(rot / angleStep) * angleStep;
        setRot(snapped);
        lastRot.current = snapped;
    };
    const activeIndex = (() => {
        const normalizedRot = ((rot % 360) + 360) % 360; // convierte a rango 0–359
        const index = Math.round(normalizedRot / angleStep) % n;
        const pos = (1 - index + n) % n; // posición 1 es la que debe estar arriba
        return pos;
    })();


    return (
        <div
            className="wrapper"
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <div
                ref={wheelRef}
                className="wheel"
                onMouseDown={onMouseDown}
                style={{
                    transform: `rotate(${rot - 60}deg)`, // -90 para que 0° apunte hacia arriba
                    transition: dragging.current ? "none" : "transform .3s ease-out",
                }}
            >
                <img src={llantaImg} alt="rueda" className="wheel-img" />
                {cards.map((c, i) => {
                    const theta = angleStep * i;
                    return (
                        <div
                            key={i}
                            className="card-wrapper"
                            style={{
                                transform: `rotate(${theta}deg) translate(0, -${radio}px)`,
                            }}
                        >
     
                                <div className={`card ${i === activeIndex ? "highlight" : ""}`}>
                                <img src={c.img} alt={c.title} />
                                <span>{c.title}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}