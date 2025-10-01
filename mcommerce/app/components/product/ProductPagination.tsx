'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  locale: string
}

export function ProductPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  locale,
}: ProductPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `/${locale}/products?${params.toString()}`
  }

  const handlePageChange = (pageNumber: number) => {
    router.push(createPageURL(pageNumber))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    const halfRange = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(1, currentPage - halfRange)
    let endPage = Math.min(totalPages, currentPage + halfRange)

    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages, maxPagesToShow)
    } else if (currentPage >= totalPages - halfRange) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              onClick={(e) => {
                if (!hasPrevPage) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                handlePageChange(currentPage - 1)
              }}
              className={!hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {pageNumbers[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href={createPageURL(1)}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(1)
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pageNumbers[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={createPageURL(pageNumber)}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(pageNumber)
                }}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={createPageURL(totalPages)}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(totalPages)
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              onClick={(e) => {
                if (!hasNextPage) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                handlePageChange(currentPage + 1)
              }}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}