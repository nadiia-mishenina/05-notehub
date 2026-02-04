import { Form, Formik, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
}

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(TAGS, "Invalid tag")
    .required("Tag is required"),
});

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: NoteFormValues) => createNote(values),
    onSuccess: () => {
      // оновлюємо список нотаток
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // закриваємо форму (модалку)
      onCancel();
    },
  });

  const handleSubmit = (values: NoteFormValues) => {
    mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <span className={css.error}>
            <FormikError name="title" />
          </span>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <span className={css.error}>
            <FormikError name="content" />
          </span>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Field>
          <span className={css.error}>
            <FormikError name="tag" />
          </span>
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
