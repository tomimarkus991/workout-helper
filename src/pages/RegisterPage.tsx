import { Link, useNavigate } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";

import { YupSchemas } from "@/app-constants";
import { FormikInput, RealButton } from "@/components";
import { supabase } from "@/utils";

interface FormValues {
  username: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();

  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
  };

  return (
    <div className="mx-4 mt-5">
      <Formik
        initialValues={initialValues}
        validationSchema={YupSchemas.Register}
        validateOnChange={true}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          const { error, data } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });

          if (error) {
            toast.error(`Signup error ${error.message}`);
            throw new Error(error.message);
          }

          const { error: insertError } = await supabase
            .from("profile")
            .insert({ id: data.user?.id as string, username: values.username });

          if (insertError) {
            toast.error(`Inserting profile error ${insertError.message}`);
            throw new Error(insertError.message);
          }

          navigate({ to: "/login" });

          resetForm();
          setSubmitting(false);
        }}
      >
        <Form className="flex flex-col">
          <FormikInput name="username" placeholder="Jack" label="Username" required />

          <FormikInput
            name="email"
            placeholder="tomi@gmail.com"
            className="mt-3"
            label="Email"
            required
          />
          <FormikInput
            name="password"
            placeholder="**********"
            label="Password"
            type="password"
            required
            className="mt-3"
          />
          <FormikInput
            name="passwordConfirmation"
            label="Password"
            placeholder="**********"
            type="password"
            required
            className="mt-3"
          />
          <RealButton className="mt-4" variant="blue" type="submit">
            Register
          </RealButton>

          <Link to="/login">
            <p className="mt-2 text-blue-600">I already have an account</p>
          </Link>
        </Form>
      </Formik>
    </div>
  );
};
