import React, { useState, useEffect } from "react";
import {
  Heart,
  Drumstick,
  Gamepad2,
  Sparkles,
  Moon,
  AlertTriangle,
} from "lucide-react";
import StartGame from "./components/StartGame";

/* ===========================
   LOCAL STORAGE KEY
=========================== */
const SAVE_KEY = "tamagotchi-save";

export default function TamagotchiGame() {
  const [pet, setPet] = useState({
    name: "",
    hunger: 80,
    happiness: 80,
    energy: 80,
    age: 0,
    stage: "egg",
    alive: true,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [petName, setPetName] = useState("");

  /* ===========================
     LOAD GAME FROM STORAGE
  =========================== */
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPet(parsed.pet);
      setGameStarted(parsed.gameStarted);
      setPetName(parsed.pet?.name || "");
      setMessage("💾 Game loaded!");
    }
  }, []);

  /* ===========================
     AUTO SAVE GAME
  =========================== */
  useEffect(() => {
    if (!gameStarted) return;
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        pet,
        gameStarted,
      }),
    );
  }, [pet, gameStarted]);

  useEffect(() => {
    if (!gameStarted || !pet.alive) return;

    const interval = setInterval(() => {
      setPet((prev) => {
        const newHunger = Math.max(0, prev.hunger - 2);
        const newHappiness = Math.max(0, prev.happiness - 1.5);
        const newEnergy = Math.max(0, prev.energy - 1);

        const alive = newHunger > 0 || newHappiness > 0 || newEnergy > 0;

        if (!alive) {
          setMessage("💔 Your pet has passed away...");
          return { ...prev, alive: false };
        }

        return {
          ...prev,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [gameStarted, pet.alive]);

  useEffect(() => {
    if (!gameStarted) return;

    const ageInterval = setInterval(() => {
      setPet((prev) => {
        if (!prev.alive) return prev;

        const newAge = prev.age + 1;
        let newStage = prev.stage;

        if (newAge >= 10 && prev.stage === "egg") newStage = "baby";
        else if (newAge >= 35 && prev.stage === "baby") newStage = "child";
        else if (newAge >= 60 && prev.stage === "child") newStage = "adult";

        if (newStage !== prev.stage) {
          setMessage(`🎉 ${prev.name} evolved to ${newStage} stage!`);
        }

        return { ...prev, age: newAge, stage: newStage };
      });
    }, 1000);

    return () => clearInterval(ageInterval);
  }, [gameStarted]);

  const startGame = () => {
    if (petName.trim()) {
      setPet((prev) => ({ ...prev, name: petName }));
      setGameStarted(true);
      setMessage(`Welcome ${petName}! 🥚`);
    }
  };

  const feed = () => {
    if (!pet.alive) return;
    setPet((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 20),
      happiness: Math.min(100, prev.happiness + 5),
    }));
    setMessage(`${pet.name} is eating! Yum! 🍖`);
  };

  const play = () => {
    if (!pet.alive) return;
    if (pet.energy < 15) {
      setMessage(`${pet.name} is too tired to play! 😴`);
      return;
    }
    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      energy: Math.max(0, prev.energy - 15),
    }));
    setMessage(`${pet.name} is having fun! 🎮`);
  };

  const sleep = () => {
    if (!pet.alive) return;
    setPet((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      hunger: Math.max(0, prev.hunger - 5),
    }));
    setMessage(`${pet.name} is sleeping... Zzz 💤`);
  };

  const clean = () => {
    if (!pet.alive) return;
    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
    }));
    setMessage(`${pet.name} feels fresh and clean! ✨`);
  };

  const reset = () => {
    localStorage.removeItem(SAVE_KEY);
    setPet({
      name: "",
      hunger: 80,
      happiness: 80,
      energy: 80,
      age: 0,
      stage: "egg",
      alive: true,
    });
    setGameStarted(false);
    setMessage("");
    setPetName("");
  };

  const getPetEmoji = () => {
    if (!pet.alive) return "💀";

    switch (pet.stage) {
      case "egg":
        return (
          <img
            key="egg"
            src="/Red-Dragon/egg.png"
            alt="Red-Dragon-Egg"
            className="w-full h-full object-contain"
          />
        );

      case "baby":
        return (
          <video
            key="baby"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source src="/Red-Dragon/baby.mp4" type="video/mp4" />
          </video>
        );

      case "child":
        return (
          <video
            key="child"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source src="/Red-Dragon/teen.mp4" type="video/mp4" />
          </video>
        );

      case "adult":
        return (
          <video
            key="adult"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source src="/Red-Dragon/adult.mp4" type="video/mp4" />
          </video>
        );

      default:
        return "❓";
    }
  };

  const getStatColor = (value) => {
    if (value > 60) return "bg-green-500";
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMood = () => {
    const avg = (pet.hunger + pet.happiness + pet.energy) / 3;
    if (avg > 70) return "😊";
    if (avg > 40) return "😐";
    if (avg > 20) return "😟";
    return "💀";
  };

  if (!gameStarted) {
    return (
      <StartGame
        petName={petName}
        setPetName={setPetName}
        onStart={startGame}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-purple-600">{pet.name}</h2>
            <p className="text-sm text-gray-600">
              Day: {pet.age} | Stage: {pet.stage}
            </p>
          </div>
          <div className="text-3xl animate-bounce">{getMood()}</div>
        </div>

        <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl mb-4 flex justify-center items-center relative overflow-hidden w-full">
          {typeof getPetEmoji() === "string" ? (
            <div className="w-48 h-48 flex items-center justify-center text-9xl">
              {getPetEmoji()}
            </div>
          ) : (
            <div className="w-full h-full max-w-md">{getPetEmoji()}</div>
          )}
          {!pet.alive && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
              <p className="text-white text-xl font-bold">R.I.P</p>
            </div>
          )}
        </div>

        {message && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 rounded">
            <p className="text-sm text-yellow-800">{message}</p>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center text-sm font-semibold">
                <Drumstick className="w-4 h-4 mr-1" /> Hunger
              </span>
              <span className="text-sm">{Math.round(pet.hunger)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${getStatColor(
                  pet.hunger,
                )}`}
                style={{ width: `${pet.hunger}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center text-sm font-semibold">
                <Heart className="w-4 h-4 mr-1" /> Happiness
              </span>
              <span className="text-sm">{Math.round(pet.happiness)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${getStatColor(
                  pet.happiness,
                )}`}
                style={{ width: `${pet.happiness}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center text-sm font-semibold">
                <Moon className="w-4 h-4 mr-1" /> Energy
              </span>
              <span className="text-sm">{Math.round(pet.energy)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${getStatColor(
                  pet.energy,
                )}`}
                style={{ width: `${pet.energy}%` }}
              />
            </div>
          </div>
        </div>

        {(pet.hunger < 30 || pet.happiness < 30 || pet.energy < 30) &&
          pet.alive && (
            <div className="bg-red-100 border-l-4 border-red-500 p-3 mb-4 rounded flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                Warning: Your pet needs attention!
              </p>
            </div>
          )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={feed}
            disabled={!pet.alive}
            className="bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            <Drumstick className="w-5 h-5 mr-2" /> Feed
          </button>
          <button
            onClick={play}
            disabled={!pet.alive}
            className="bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            <Gamepad2 className="w-5 h-5 mr-2" /> Play
          </button>
          <button
            onClick={sleep}
            disabled={!pet.alive}
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            <Moon className="w-5 h-5 mr-2" /> Sleep
          </button>
          <button
            onClick={clean}
            disabled={!pet.alive}
            className="bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2" /> Clean
          </button>
        </div>

        {!pet.alive && (
          <button
            onClick={reset}
            className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            New Game
          </button>
        )}
      </div>
    </div>
  );
}
