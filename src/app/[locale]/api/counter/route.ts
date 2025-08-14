import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import z from 'zod';
import { counters } from '@/libs/CounterStorage';
import { logger } from '@/libs/Logger';
import { CounterValidation } from '@/validations/CounterValidation';

export const PUT = async (request: Request) => {
  const json = await request.json();
  const parse = CounterValidation.safeParse(json);

  if (!parse.success) {
    return NextResponse.json(z.treeifyError(parse.error), { status: 422 });
  }

  // `x-e2e-random-id` is used for end-to-end testing to make isolated requests
  // The default value is 0 when there is no `x-e2e-random-id` header
  const id = Number((await headers()).get('x-e2e-random-id')) ?? 0;

  // Get current count or initialize to 0
  const currentCount = counters.get(id) ?? 0;
  const newCount = currentCount + parse.data.increment;

  // Update in-memory storage
  counters.set(id, newCount);

  logger.info('Counter has been incremented');

  return NextResponse.json({
    count: newCount,
  });
};
