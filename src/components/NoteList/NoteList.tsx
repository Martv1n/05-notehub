import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '../../services/noteService'
import type { DeleteNoteResponse } from '../../services/noteService'
import type { Note } from '../../types/note'
import css from './NoteList.module.css'

interface NoteListProps {
  notes: Note[]
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<DeleteNoteResponse, Error, string>({
    mutationFn: (id) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'], exact: false })
    },
  })

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li className={css.listItem} key={n._id}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button
              className={css.button}
              onClick={() => mutation.mutate(n._id)}
              disabled={mutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NoteList
