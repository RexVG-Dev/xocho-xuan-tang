import { title } from "process";

interface CardInterface {
  title: string;
  border: 'error' | 'succes' | 'warning' | 'none';
  paddding: boolean;
  children: string;
};


export function Card(
  {
    title,
    border = 'none',
    paddding = true,
    children
  }: CardInterface
) {
  return (
    <div className="">
      {title && (
        <div className="">
          {title}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}

export default Card;
