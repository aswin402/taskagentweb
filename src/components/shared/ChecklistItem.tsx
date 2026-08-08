import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Clock, Edit, AlertCircle, Plus, Minus } from 'lucide-react';
import type { Task } from '@/api/tasks';
import { TASK_CATEGORIES } from '@/lib/constants';

interface ChecklistItemProps {
  task: Task;
  isCompleted: boolean;
  reason: string | null;
  completedQuantity?: number;
  onToggle: (checked: boolean) => void;
  onQuantityChange?: (quantity: number) => void;
  onEditReason: () => void;
}

export function ChecklistItem({
  task,
  isCompleted,
  reason,
  completedQuantity = 0,
  onToggle,
  onQuantityChange,
  onEditReason,
}: ChecklistItemProps) {
  const formatTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const targetQty = (task as any).target_quantity;
  const unit = (task as any).unit || 'units';

  const handleCheckboxChange = (checked: boolean) => {
    if (targetQty && targetQty > 0 && onQuantityChange) {
      onQuantityChange(checked ? targetQty : 0);
    } else {
      onToggle(checked);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border rounded-xl bg-card transition-all ${
      isCompleted ? 'border-emerald-500/20 bg-emerald-500/5' : 'hover:border-border/80'
    }`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="pt-0.5">
          <Checkbox
            id={`chk-${task.id}`}
            checked={isCompleted}
            onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
            className="h-5 w-5 rounded-md"
          />
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <label
            htmlFor={`chk-${task.id}`}
            className={`text-base font-semibold leading-none cursor-pointer select-none transition-all ${
              isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}
          >
            {task.title}
          </label>
          {task.description && (
            <p className={`text-xs text-muted-foreground leading-normal ${isCompleted ? 'text-muted-foreground/60' : ''}`}>
              {task.description}
            </p>
          )}

          {/* Numeric Quantity Progress Section */}
          {targetQty && targetQty > 0 && onQuantityChange && (
            <div className="mt-2.5 flex items-center gap-3 bg-muted/30 border border-border/40 px-3 py-1.5 rounded-lg w-fit shadow-inner">
              <span className="text-xs text-muted-foreground">Progress:</span>
              
              <div className="flex items-center border border-input bg-background/50 rounded-lg p-0.5 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all"
                  onClick={() => onQuantityChange(Math.max(0, completedQuantity - 1))}
                  disabled={completedQuantity <= 0}
                  type="button"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                
                <input
                  type="number"
                  value={completedQuantity}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    onQuantityChange(val);
                  }}
                  className="w-12 text-center text-sm font-semibold bg-transparent border-0 focus-visible:ring-0 focus:outline-none p-0 select-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all"
                  onClick={() => onQuantityChange(completedQuantity + 1)}
                  type="button"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <span className="text-xs font-semibold text-foreground">
                / {targetQty} {unit}
              </span>
              {completedQuantity < targetQty ? (
                <span className="text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium dark:text-amber-400">
                  {targetQty - completedQuantity} remaining
                </span>
              ) : (
                <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium dark:text-emerald-400">
                  Target met!
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-1">
            {task.category === TASK_CATEGORIES.SCHEDULED && task.scheduled_at && (
              <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-500/10 px-1.5 py-0.5 rounded font-medium dark:text-orange-400">
                <Clock className="h-2.5 w-2.5" />
                {formatTime(task.scheduled_at)}
              </span>
            )}
            {task.is_recurring && (
              <span className="text-[10px] text-purple-600 bg-purple-500/10 px-1.5 py-0.5 rounded font-medium dark:text-purple-400">
                Recurring
              </span>
            )}
            {task.status === 'rolled_over' && (
              <span className="text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium dark:text-amber-400">
                Rolled Over
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Completion Reason Section for Unchecked Items */}
      {!isCompleted && (
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pl-8 sm:pl-0">
          {reason ? (
            <div className="flex items-center justify-between gap-3 bg-muted border border-border px-3 py-1.5 rounded-lg text-xs w-full sm:w-auto">
              <span className="text-muted-foreground italic truncate max-w-[150px] sm:max-w-[200px]">
                Reason: {reason}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-muted" onClick={onEditReason}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit Reason</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditReason}
              className="text-xs text-rose-500 border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-600 w-full sm:w-auto"
            >
              <AlertCircle className="h-3 w-3 mr-1.5" />
              Provide Reason
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ChecklistItem;
