// In the watchlist item, add a Watch Now button:

<button
  onClick={(e) => {
    e.preventDefault();
    window.open(YOUR_DIRECT_LINK, '_blank');
  }}
  className="mt-2 w-full py-1 bg-gold text-black rounded-lg text-sm font-medium hover:bg-gold/80 transition"
>
  ▶️ Watch Now
</button>
