'use strict'

export type SomeType = {
  id: string;
  name: string;
};

export interface SomeObject {
  id: string;
  type: SomeType;
}
