export default function StartGame({ petName, setPetName, onStart }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-400 via-pink-400 to-blue-400">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-purple-600">
          Tamagotchi
        </h1>
        <p className="text-center text-gray-600 mb-6">Virtual Pet Game</p>
        <div className="text-center mb-6">
          <div className="text-8xl mb-4">?</div>
          <p className="text-gray-700">Name your new pet!</p>
        </div>
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Enter pet name..."
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
          maxLength={12}
        />
        <button
          onClick={onStart}
          disabled={!petName.trim()}
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
