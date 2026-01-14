import { useQuery } from '@tanstack/react-query'

export const useGetGigs = () => {
  const {
    data: gigs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gigs'],
    queryFn: () => fetch('/api/gigs').then((res) => res.json()),
  })

  return {
    gigs,
    isLoading,
    error,
  }
}
