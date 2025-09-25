import { redirect } from 'next/navigation';
export default function NameRedirect() {
  redirect('/welcome');
}