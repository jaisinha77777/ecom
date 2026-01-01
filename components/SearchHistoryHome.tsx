import { getSearchLogsHome } from '@/actions/searchActions'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import Link from 'next/link'
import { ScrollArea } from './ui/scroll-area'

const SearchHistoryHome = () => {
  const {data : history , isLoading} = useQuery({
    queryKey: ['searchLogsHome'],
    queryFn: getSearchLogsHome
  })
  if(isLoading) {
    return null
  }

  return (
   <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Your Searches
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <ScrollArea  className="h-80">
          <ul className="divide-y">
            {history.map((item, i) => {
              const hasProduct = item.product !== null;

              const label = hasProduct
                ? item.product.productName
                : `Search results for “${item.searchQuery}”`;

              const href = hasProduct
                ? `/product/${item.product.productId}`
                : `/search?q=${encodeURIComponent(item.searchQuery)}`;

              return (
                <li key={i}>
                  <Link
                    href={href}
                    className="block px-4 py-3 hover:bg-muted transition rounded-sm"
                  >
                    <p className="line-clamp-2 text-sm font-medium">
                      {label}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default SearchHistoryHome
