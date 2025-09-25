type Props = { message: string };
export default function LiveRegion({ message }: Props) {
  return (
    <div aria-live="polite" aria-atomic="true" className="visually-hidden">
      {message}
    </div>
  );
}
