import { Paginate, ResponseError } from 'modules/common/types';
import { UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';

export const getAllIds = (
  selectedRow: Record<string, boolean>,
  data: Paginate<any> | undefined
) => {
  if (!data) {
    return;
  }

  const ids = Object.keys(selectedRow)
    .map((index) => data.items[parseInt(index)].id)
    .filter((id) => id !== undefined) as string[];

  return ids;
};

export const setValidationError = (
  error: ResponseError,
  setError: UseFormSetError<any>
) => {
  if (error.errors?.code === 422) {
    const validationMessages = error.errors.message;
    console.log(validationMessages);
    if (validationMessages) {
      for (const key in validationMessages) {
        setError(snakeCaseToCamelCase(key) as string, {
          type: 'server',
          message: validationMessages[key],
        });
      }
    }
  }
};

export const showErrorMessage = (error: ResponseError) => {
  if (error.errors) {
    Object.values(error.errors.message).forEach((message) => {
      toast(message, {
        autoClose: false,
      });
    });
  }
};

// ex: ["HO6FI001"] -> HO6FI001
export const removeSquareBracket = (characters: string | undefined) => {
  if (!characters) {
    return '';
  }
  return characters.replace('["', '').replace('"]', '');
};

// Ex: 2021-09-22 10:34:31 -> 2021/09/22 10:34
export const formatTime = (date: string) => {
  const splittedDate = date.split(' ');
  const formattedDate = splittedDate[0].split('-').join('/');
  const formattedTime = splittedDate[1].substring(0, 5);
  const result = `${formattedDate} ${formattedTime}`;
  return result;
};

export const parseUndescoreString = (text: string) => {
  return text.replace('_', ' ');
};

export const parseMenuToUrl = (menu: string) => {
  const url =
    menu === 'asset groups'
      ? '/master-capex/asset-groups'
      : menu === 'catalogs'
      ? '/master-capex/catalogs'
      : menu === 'outstanding budgets'
      ? '/master-capex/outstanding-budget'
      : '/';
  return url;
};

// Ex: hello_world -> helloWorld
export const snakeCaseToCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );
};
