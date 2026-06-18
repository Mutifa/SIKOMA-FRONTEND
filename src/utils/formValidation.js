import { errorAlert } from './alert.js'

function getInputLabel(element) {
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`)
    if (label?.textContent) return label.textContent.trim()
  }

  const parentLabel = element.closest('label')
  if (parentLabel?.textContent) return parentLabel.textContent.trim()

  const fieldWrapper = element.closest('.mb-3, .form-group, .akun-settings-field, .akun-form-group, .akun-password-control, [class*="col-"]')
  const siblingLabel = fieldWrapper?.querySelector('label')
  if (siblingLabel?.textContent) return siblingLabel.textContent.trim()

  return element.placeholder || element.name || 'Field ini'
}

function isEmptyValue(element) {
  if (element.type === 'checkbox' || element.type === 'radio') {
    return !element.checked
  }

  if (element.type === 'file') {
    return !(element.files && element.files.length > 0)
  }

  const value = element.value ?? ''
  return String(value).trim().length === 0
}

export const validateFormInputs = async (form) => {
  const inputs = Array.from(form.elements).filter((element) =>
    element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA'
  )

  for (const input of inputs) {
    if (!input.hasAttribute('required')) continue

    if (isEmptyValue(input)) {
      const label = getInputLabel(input)
      await errorAlert('Validasi', `${label} wajib diisi.`)
      input.focus()
      return false
    }
  }

  return true
}
