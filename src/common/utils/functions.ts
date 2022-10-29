// import * as cryptoRandomString from 'crypto-random-string';

export function removeSpecialCharacters(text: string): string {
  return text.replace(/[`\s~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}

export function paginateResponse(data, page, limit) {
  const [result, total] = data;
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    statusCode: 'success',
    data: [...result],
    count: total,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  };
}

export function generateFileUniqueName() {
  return Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('')
    .concat('_')
    .concat(Date.now().toString());
}

export async function generateReferralCode(length?: number): Promise<string> {
  length = length || 12;
  return '1';
//   return await cryptoRandomString.cryptoRandomStringAsync({ length, type: 'alphanumeric' });
}
