import React, { useState } from 'react';
import { Text, Paper, Group, ActionIcon, Box, Button } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import styles from './CustomCalendar.module.css';

interface CustomCalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  selectedDates?: Date[];
  onMultiSelect?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  size?: 'sm' | 'md' | 'lg';
  multiSelect?: boolean;
  className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  selectedDates = [],
  onMultiSelect,
  minDate,
  maxDate,
  size = 'md',
  multiSelect = false,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (multiSelect) {
      return selectedDates.some(d => 
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    }
    return value && 
      value.getDate() === date.getDate() &&
      value.getMonth() === date.getMonth() &&
      value.getFullYear() === date.getFullYear();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (multiSelect && onMultiSelect) {
      const isSelected = isDateSelected(date);
      let newSelectedDates: Date[];
      
      if (isSelected) {
        newSelectedDates = selectedDates.filter(d => 
          !(d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear())
        );
      } else {
        newSelectedDates = [...selectedDates, date];
      }
      
      onMultiSelect(newSelectedDates);
    } else if (onChange) {
      onChange(date);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.emptyDay}`} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = isDateSelected(date);
      const isDisabled = isDateDisabled(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          className={`
            ${styles.calendarDay} 
            ${styles.dayButton}
            ${styles[size]}
            ${isSelected ? styles.selected : ''}
            ${isDisabled ? styles.disabled : ''}
            ${isToday ? styles.today : ''}
          `}
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
          type="button"
        >
          <span className={styles.dayNumber}>{day}</span>
          {isToday && <div className={styles.todayIndicator} />}
        </button>
      );
    }

    return days;
  };

  return (
    <Paper className={`${styles.calendar} ${styles[size]} ${className}`} p="md" radius="lg" withBorder>
      {/* Header */}
      <Group justify="space-between" mb="md" className={styles.calendarHeader}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={() => navigateMonth('prev')}
          className={styles.navButton}
          radius="xl"
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        
        <div className={styles.monthYear}>
          <Text fw={600} size="lg" className={styles.monthText}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
        </div>
        
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={() => navigateMonth('next')}
          className={styles.navButton}
          radius="xl"
        >
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>

      {/* Day names */}
      <div className={styles.dayNames}>
        {dayNames.map(day => (
          <div key={day} className={styles.dayName}>
            <Text size="sm" fw={500} c="dimmed">
              {day}
            </Text>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.calendarGrid}>
        {renderCalendarDays()}
      </div>

      {/* Selection info for multi-select */}
      {multiSelect && selectedDates.length > 0 && (
        <Paper mt="xs" p="xs" bg="blue.0" className={styles.selectionInfo} radius="md">
          <Text size="xs" c="blue" ta="center" fw={500}>
            {selectedDates.length} {selectedDates.length === 1 ? 'date' : 'dates'} selected
          </Text>
        </Paper>
      )}
    </Paper>
  );
};

export default CustomCalendar;