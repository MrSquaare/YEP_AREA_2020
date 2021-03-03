import { Account, APIResponse, User } from "@area-common/types";
import { Router } from "express";

import {
  ACCOUNT_NOT_EXISTS_ERROR,
  ADMIN_ACCOUNT_ROUTE,
  BAD_REQUEST_ERROR,
} from "../../../../constants";
import { hasAKeysOf } from "../../../../utilities/type";

export const adminAccountRouter = Router();

adminAccountRouter.use(ADMIN_ACCOUNT_ROUTE, async (req, res, next) => {
  try {
    const id = (req.user as User).id;
    const account = await req.accountRepository.exists({ userId: id });

    if (!account) {
      return next(ACCOUNT_NOT_EXISTS_ERROR);
    }

    return next();
  } catch (e) {
    return next(e);
  }
});

adminAccountRouter.get(ADMIN_ACCOUNT_ROUTE, async (req, res, next) => {
  try {
    const id = (req.user as User).id;
    const account = await req.accountRepository.read({ userId: id });

    const response: APIResponse = {
      status: 200,
      data: account,
    };

    return res.json(response);
  } catch (e) {
    return next(e);
  }
});

adminAccountRouter.post(ADMIN_ACCOUNT_ROUTE, async (req, res, next) => {
  try {
    const id = (req.user as User).id;
    const partial: Partial<Account> = req.body;
    const [hasKeys] = hasAKeysOf<Account>(partial, ["email", "password"]);

    if (!hasKeys) {
      return next(BAD_REQUEST_ERROR);
    }

    const account = await req.accountRepository.update({ userId: id }, partial);

    const response: APIResponse = {
      status: 200,
      data: account,
    };

    return res.json(response);
  } catch (e) {
    return next(e);
  }
});
