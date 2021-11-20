/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React, { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthenticationTypes,
  LoginForm,
} from "../../common/dtos/authentication";
import { endpoint, isHosted, request } from "../../common/helpers";
import { authenticate } from "../../common/stores/slices/user";
import { AxiosError, AxiosResponse } from "axios";
import { LoginValidation } from "./common/ValidationInterface";
import { useTranslation } from "react-i18next";
import Logo from "../../resources/images/invoiceninja-logo@dark.png";
import { InputField } from "../../components/forms/InputField";
import { Button } from "../../components/forms/Button";
import { Link } from "../../components/forms/Link";
import { InputLabel } from "../../components/forms/InputLabel";
import { Alert } from "../../components/Alert";
import { RootState } from "../../common/stores/store";
import { HostedLinks } from "./components/HostedLinks";

export function Login() {
  const colors = useSelector((state: RootState) => state.settings.colors);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<LoginValidation | undefined>(undefined);
  const [isFormBusy, setIsFormBusy] = useState(false);
  const [t] = useTranslation();

  useEffect(() => {
    document.title = `${import.meta.env.VITE_APP_TITLE}: ${t("login")}`;
  });

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values: LoginForm) => {
      setMessage("");
      setErrors(undefined);
      setIsFormBusy(true);

      request("POST", endpoint("/api/v1/login"), values)
        .then((response: AxiosResponse) => {
          dispatch(
            authenticate({
              type: AuthenticationTypes.TOKEN,
              user: response.data.data[0].user,
              token: response.data.data[0].token.token,
            })
          );
        })
        .catch((error: AxiosError) => {
          return error.response?.status === 422
            ? setErrors(error.response.data.errors)
            : setMessage(
                error.response?.data.message ?? t("invalid_credentials")
              );
        })
        .finally(() => setIsFormBusy(false));
    },
  });

  return (
    <div className="h-screen md:bg-gray-100">
      <div className={`bg-${colors.primary} py-1`}></div>
      <div className="flex justify-center py-8">
        <Link to="/">
          <img src={Logo} alt="Invoice Ninja Logo" className="h-12" />
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-white mx-4 max-w-md w-full p-8 rounded md:shadow-lg">
          <h2 className="text-2xl">{t("login")}</h2>

          <form onSubmit={form.handleSubmit} className="my-6">
            <InputField
              type="email"
              label={t("email_address")}
              id="email"
              onChange={form.handleChange}
            />

            {errors?.email && (
              <Alert className="mt-2" type="danger">
                {errors.email}
              </Alert>
            )}

            <div className="flex items-center justify-between mt-4">
              <InputLabel>{t("password")}</InputLabel>
              <Link to="/recover_password">{t("forgot_password")}</Link>
            </div>

            <InputField
              type="password"
              className="mt-2"
              id="password"
              onChange={form.handleChange}
            />

            {errors?.password && (
              <Alert className="mt-2" type="danger">
                {errors.password}
              </Alert>
            )}

            {message && (
              <Alert className="mt-4" type="danger">
                {message}
              </Alert>
            )}

            <Button disabled={isFormBusy} className="mt-4" variant="block">
              {t("login")}
            </Button>
          </form>

          <div className="flex justify-center">
            {isHosted() && <Link to="/register">{t("register_label")}</Link>}
          </div>
        </div>

        {isHosted() && (
          <div className="bg-white mx-4 max-w-md w-full rounded md:shadow-lg mt-4">
            <HostedLinks />
          </div>
        )}
      </div>
    </div>
  );
}
