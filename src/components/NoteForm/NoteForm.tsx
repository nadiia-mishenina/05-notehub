import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik';
import * as Yup from 'yup';
import type { NoteTag } from "../../types/note";
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (values: NoteFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required('Required'),
  content: Yup.string().max(500, 'Max 500 characters'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

export default function NoteForm({ onCancel, onSubmit, isSubmitting = false }: NoteFormProps) {
  const initialValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, actions) => {
        await onSubmit(values);
        actions.resetForm();
      }}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" type="text" className={css.input} />
          <FormikError name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field id="content" name="content" as="textarea" rows={8} className={css.textarea} />
          <FormikError name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" name="tag" as="select" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <FormikError name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isSubmitting}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}