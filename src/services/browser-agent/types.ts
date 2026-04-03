export interface ClickableElement {
  text: string
  x: number // Percentage 0-100
  y: number // Percentage 0-100
  type: 'button' | 'link'
}

export interface BrowserAgentResponse {
  screenshot_url?: string
  screenshot_buffer?: Buffer
  page_title: string
  clickable_elements: ClickableElement[]
  interaction_trace: string[]
}

export interface BrowserAgentRequest {
  url: string
  user_id?: string
  project_id?: string
}
