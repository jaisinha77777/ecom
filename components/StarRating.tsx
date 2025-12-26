import { Star } from "lucide-react"

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.min(Math.max(rating - (star - 1), 0), 1) * 100
        
        return (
          <div key={star} className="relative w-5 h-5">
            {/* Background star */}
            <Star className="w-5 h-5 text-gray-300" />

            {/* Filled overlay */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
