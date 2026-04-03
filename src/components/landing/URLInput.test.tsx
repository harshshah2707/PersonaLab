import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { URLInput, validateURL, normalizeURL } from './URLInput'

describe('validateURL', () => {
  describe('valid URLs', () => {
    it('accepts valid HTTPS URLs', () => {
      const result = validateURL('https://example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts valid HTTP URLs', () => {
      const result = validateURL('http://example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts URLs without protocol (defaults to https)', () => {
      const result = validateURL('example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts URLs with paths and query parameters', () => {
      const result = validateURL('https://example.com/path?query=value')
      expect(result.isValid).toBe(true)
    })

    it('accepts URLs with subdomains', () => {
      const result = validateURL('https://sub.example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts URLs with ports', () => {
      const result = validateURL('https://example.com:8080')
      expect(result.isValid).toBe(true)
    })
  })

  describe('empty and invalid format', () => {
    it('rejects empty string', () => {
      const result = validateURL('')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('format')
    })

    it('rejects whitespace-only string', () => {
      const result = validateURL('   ')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('format')
    })

    it('rejects malformed URL', () => {
      const result = validateURL('not a url')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('format')
    })

    it('rejects domain without TLD', () => {
      const result = validateURL('localhost')
      // localhost is actually blocked, not format error
      expect(result.isValid).toBe(false)
    })
  })

  describe('blocked protocols', () => {
    it('rejects javascript: protocol', () => {
      const result = validateURL('javascript:alert(1)')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('protocol')
    })

    it('rejects data: protocol', () => {
      const result = validateURL('data:text/html,<script>alert(1)</script>')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('protocol')
    })

    it('rejects file: protocol', () => {
      const result = validateURL('file:///etc/passwd')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('protocol')
    })

    it('rejects vbscript: protocol', () => {
      const result = validateURL('vbscript:msgbox(1)')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('protocol')
    })
  })

  describe('blocked internal networks', () => {
    it('rejects localhost', () => {
      const result = validateURL('http://localhost')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })

    it('rejects 127.0.0.1', () => {
      const result = validateURL('http://127.0.0.1')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })

    it('rejects 192.168.x.x addresses', () => {
      const result = validateURL('http://192.168.1.1')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })

    it('rejects 10.x.x.x addresses', () => {
      const result = validateURL('http://10.0.0.1')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })

    it('rejects 172.16-31.x.x addresses', () => {
      const result = validateURL('http://172.16.0.1')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })

    it('rejects .local domains', () => {
      const result = validateURL('http://test.local')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })

    it('rejects .internal domains', () => {
      const result = validateURL('http://api.internal')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })

    it('rejects 0.0.0.0', () => {
      const result = validateURL('http://0.0.0.0')
      expect(result.isValid).toBe(false)
      expect(result.errorType).toBe('blocked')
    })
  })
})

describe('normalizeURL', () => {
  it('adds https:// to URLs without protocol', () => {
    expect(normalizeURL('example.com')).toBe('https://example.com')
  })

  it('preserves existing https://', () => {
    expect(normalizeURL('https://example.com')).toBe('https://example.com')
  })

  it('preserves existing http://', () => {
    expect(normalizeURL('http://example.com')).toBe('http://example.com')
  })

  it('handles URLs with paths', () => {
    expect(normalizeURL('example.com/path')).toBe('https://example.com/path')
  })

  it('trims whitespace', () => {
    expect(normalizeURL('  example.com  ')).toBe('https://example.com')
  })

  it('returns empty string for empty input', () => {
    expect(normalizeURL('')).toBe('')
  })
})

describe('URLInput Component', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders input with placeholder', () => {
    render(<URLInput onSubmit={mockOnSubmit} placeholder="Enter URL" />)
    expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument()
  })

  it('updates value on input change', () => {
    render(<URLInput onSubmit={mockOnSubmit} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'https://example.com' } })
    expect(input).toHaveValue('https://example.com')
  })

  it('calls onSubmit with normalized URL on valid submission', async () => {
    const user = userEvent.setup()
    render(<URLInput onSubmit={mockOnSubmit} />)
    const input = screen.getByRole('textbox')
    
    // Type the URL
    await user.type(input, 'example.com')
    
    // Submit the form by pressing Enter
    await user.type(input, '{enter}')
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com')
    })
  })

  it('shows error for invalid URL on submit', async () => {
    const user = userEvent.setup()
    render(<URLInput onSubmit={mockOnSubmit} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /run simulation/i })
    
    await user.type(input, 'invalid')
    await user.click(button)
    
    // The error should appear after submit (which triggers validation)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('shows error for blocked localhost URL', async () => {
    const user = userEvent.setup()
    render(<URLInput onSubmit={mockOnSubmit} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /run simulation/i })
    
    await user.type(input, 'http://localhost')
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/internal network/i)).toBeInTheDocument()
    })
  })

  it('disables input and button when loading', () => {
    render(<URLInput onSubmit={mockOnSubmit} isLoading />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables input and button when disabled prop is true', () => {
    render(<URLInput onSubmit={mockOnSubmit} disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state in button', () => {
    render(<URLInput onSubmit={mockOnSubmit} isLoading />)
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })

  it('does not call onSubmit when URL is empty', async () => {
    const user = userEvent.setup()
    render(<URLInput onSubmit={mockOnSubmit} />)
    const button = screen.getByRole('button', { name: /run simulation/i })
    
    await user.click(button)
    
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  it('validates on blur when validateOnBlur is true', async () => {
    const user = userEvent.setup()
    render(<URLInput onSubmit={mockOnSubmit} validateOnBlur />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'http://localhost')
    await user.click(document.body) // blur by clicking elsewhere
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('does not validate on blur when validateOnBlur is false', async () => {
    const user = userEvent.setup()
    render(<URLInput onSubmit={mockOnSubmit} validateOnBlur={false} />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'http://localhost')
    await user.click(document.body) // blur by clicking elsewhere
    
    // Wait a bit to ensure no error appears
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})