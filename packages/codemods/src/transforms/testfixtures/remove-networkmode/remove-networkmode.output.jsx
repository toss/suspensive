const options = queryOptions({
  queryKey: ['key'],
  queryFn: () => Promise.resolve('data')
});

const options2 = notQueryOptions({
  queryKey: ['key'],
  networkMode: 'always',
  queryFn: () => Promise.resolve('data'),
});

const result = useSuspenseQuery({
  queryKey: ['key'],
  queryFn: () => Promise.resolve('data')
});

const options3 = queryOptions({
  queryKey: ['key'],
  queryFn: () => Promise.resolve('data')
});

const options4 = queryOptions({
  queryKey: ['key'],
  staleTime: 5000,
  retry: 2,
  queryFn: () => Promise.resolve('data')
});

const options5 = queryOptions({
  queryKey: ['key'],
  networkMode: 'offlineFirst',
  queryFn: () => Promise.resolve('data'),
});

const options6 = api.useSuspenseQuery({
  queryKey: ['key'],
  networkMode: 'always',
  queryFn: () => Promise.resolve('data'),
});

const options7 = queryOptions('invalid');

const params = {
  queryKey: ['key'],
  networkMode: 'always',
};
const options8 = queryOptions(params);
