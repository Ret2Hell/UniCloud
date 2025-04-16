import { formatDate } from "@/lib/utils";

const CardInfo = ({ name, date }: CardInfoProps) => (
  <div className="flex-1 min-w-0">
    <p className="font-medium truncate">{name}</p>
    <p className="text-xs text-muted-foreground">
      {formatDate(new Date(date))}
    </p>
  </div>
);

export default CardInfo;
