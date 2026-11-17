import { useEffect, useMemo, useState } from 'react'
import { Download, Pencil, Plus, Trash2 } from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import SearchInput from '../../components/common/SearchInput.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { StatusPill } from '../../components/common/Display.jsx'
import { Select, Input, Textarea } from '../../components/common/FormFields.jsx'
import { TableSkeleton } from '../../components/common/States.jsx'
import { resourceConfigs } from '../../data/adminConfig.jsx'
import { store } from '../../data/store.js'
import { createResource, deleteResource, listResource, updateResource } from '../../services/adminService.js'
import { useToast } from '../../context/ToastContext.jsx'

const PAGE_SIZE = 8

function parseValue(field, value) {
  if (field.type === 'number') return Number(value) || 0
  if (field.type === 'list') return String(value).split(',').map((part) => part.trim()).filter(Boolean)
  if (field.type === 'numberList') return String(value).split(',').map((part) => Number(part.trim())).filter((item) => !Number.isNaN(item))
  return value
}

function initialValue(field, row) {
  const value = row?.[field.name]
  if (field.type === 'list' || field.type === 'numberList') return Array.isArray(value) ? value.join(', ') : ''
  return value ?? ''
}

export default function AdminResourcePage({ resourceKey }) {
  const config = resourceConfigs[resourceKey]
  const { toast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      setItems(await listResource(resourceKey))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    setSearch('')
    setFilter('all')
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceKey])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return items.filter((item) => {
      if (filter !== 'all' && config.filterField && item[config.filterField] !== filter) return false
      if (!term) return true
      return config.searchFields.some((field) => String(item[field] ?? '').toLowerCase().includes(term))
    })
  }, [items, search, filter, config])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    setForm(Object.fromEntries(config.fields.map((field) => [field.name, initialValue(field, null)])))
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm(Object.fromEntries(config.fields.map((field) => [field.name, initialValue(field, row)])))
    setFormOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = Object.fromEntries(
        config.fields.map((field) => [field.name, parseValue(field, form[field.name])]),
      )
      if (editing?.id) {
        await updateResource(resourceKey, editing.id, payload)
        toast.success(`${config.singular} updated.`, 'Saved')
      } else {
        await createResource(resourceKey, payload)
        toast.success(`${config.singular} created.`, 'Added')
      }
      setFormOpen(false)
      await load()
    } catch (error) {
      toast.error(error.message, 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    setSaving(true)
    try {
      await deleteResource(resourceKey, deleting.id)
      toast.success(`${config.singular} deleted.`, 'Removed')
      setDeleting(null)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const exportCsv = () => {
    const header = config.columns.map((column) => column.label)
    const rows = filtered.map((row) =>
      config.columns.map((column) => {
        const value = row[column.key]
        return Array.isArray(value) ? value.join(' | ') : String(value ?? '')
      }),
    )
    const csv = [header, ...rows].map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `phannya-${resourceKey}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('CSV file downloaded.', 'Export complete')
  }

  const Icon = config.icon

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Management</p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{config.title}</h2>
          <p className="mt-1 text-sm text-muted">{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={exportCsv}>
            Export CSV
          </Button>
          <Button variant="gold" size="sm" icon={Plus} onClick={openCreate}>
            Add {config.singular}
          </Button>
        </div>
      </div>

      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder={`Search ${config.title.toLowerCase()}…`}
          className="w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-3">
          {config.filterField && (
            <select
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value)
                setPage(1)
              }}
              className="select w-full sm:w-48"
              aria-label="Filter records"
            >
              {config.filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All statuses' : option.replace('-', ' ')}
                </option>
              ))}
            </select>
          )}
          <span className="hidden shrink-0 text-xs text-muted lg:block">
            {filtered.length} record{filtered.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="card overflow-hidden">
          <div className="table-wrap">
            <table className="table-base">
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={row.id}>
                    {config.columns.map((column) => (
                      <td key={column.key}>
                        {column.badge ? (
                          <StatusPill status={row[column.key]} />
                        ) : (
                          column.render?.(row) ?? row[column.key] ?? '—'
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button type="button" onClick={() => openEdit(row)} className="btn-icon !h-8 !w-8" aria-label={`Edit ${config.singular}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(row)}
                          className="btn-icon !h-8 !w-8 hover:!border-crimson hover:!text-crimson"
                          aria-label={`Delete ${config.singular}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paged.length === 0 && (
            <div className="flex flex-col items-center py-14 text-center">
              <Icon className="h-8 w-8 text-muted" />
              <p className="mt-3 text-sm font-medium text-ink">No records found</p>
              <p className="mt-1 text-xs text-muted">Adjust your search or add a new {config.singular.toLowerCase()}.</p>
            </div>
          )}
          <div className="px-5">
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`${editing ? 'Edit' : 'Add'} ${config.singular}`}
        subtitle={editing ? `Editing ${editing.id}` : `Create a new ${config.singular.toLowerCase()}`}
        size="lg"
      >
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((field) => {
            const common = {
              name: field.name,
              label: field.label,
              hint: field.hint,
              value: form[field.name] ?? '',
              onChange: (event) => setForm({ ...form, [field.name]: event.target.value }),
              required: field.required,
            }
            if (field.type === 'textarea') {
              return <Textarea key={field.name} {...common} className="sm:col-span-2" rows={3} />
            }
            if (field.type === 'select') {
              const options = field.optionsKey
                ? (store[field.optionsKey] || []).map((item) => ({
                    value: item.id,
                    label: item[field.optionLabel] || item.name || item.id,
                  }))
                : field.options
              return <Select key={field.name} {...common} options={[{ value: '', label: 'Select…' }, ...options]} />
            }
            return (
              <Input
                key={field.name}
                {...common}
                type={field.type === 'number' || field.type === 'date' || field.type === 'time' ? field.type : 'text'}
                step={field.type === 'number' ? 'any' : undefined}
              />
            )
          })}
          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setFormOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={saving}>
              {editing ? 'Save changes' : `Create ${config.singular}`}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title={`Delete ${config.singular}?`}
        message={`${deleting?.title || deleting?.name || deleting?.reference || deleting?.label || 'This record'} will be permanently removed from the demo store.`}
        confirmLabel="Delete"
        loading={saving}
      />
    </div>
  )
}
