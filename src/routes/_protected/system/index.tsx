import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/system/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/system/"!</div>
}
