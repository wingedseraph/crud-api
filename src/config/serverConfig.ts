import { availableParallelism } from 'node:os';

export const getServerConfig = () => {
  const SINGLE_PORT = Number(process.env.SINGLE_PORT) || 4000;
  const MULTI_PORT = Number(process.env.MULTI_PORT) || 5050;
  const numCPUs =  availableParallelism() - 1;

  return {
    SINGLE_PORT,
    MULTI_PORT,
    numCPUs,
  };
};