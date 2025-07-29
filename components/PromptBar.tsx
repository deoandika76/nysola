<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
  <input
    type="text"
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    className="w-full bg-carbon border border-gray-600 text-white px-4 py-2 rounded"
    placeholder="Tulis instruksi ke Nysola..."
  />
  <button type="submit" className="bg-orchid px-4 py-2 rounded text-black font-bold w-full sm:w-auto">
    Kirim
  </button>
</form>