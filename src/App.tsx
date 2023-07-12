import { MouseEvent, cloneElement, useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import './App.scss';
import { classNames } from './classNames';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
type KeyboardButton = {
  id: string;
  element: JSX.Element;
  name?: string;
  margin?: { left?: number; right?: number };
  size?: number;
};

type KeyboardLayout = { id: string; elements: Array<KeyboardButton> };

const buildKeyboardLayout = (row: number, col: number) => {
  const result = [];
  for (let i = 0; i < row; i++) {
    const cols = [];
    for (let j = 0; j < col; j++) {
      cols.push({ id: `${i}-${j}`, element: <Button /> });
    }
    result.push({
      id: i.toString(),
      elements: cols,
    });
  }

  return result as [];
};

function getOffset(id: string) {
  const rect = document.getElementById(id)?.getBoundingClientRect();
  return {
    top: (rect?.top ?? 0) + window.scrollY,
    left: (rect?.left ?? 0) + window.scrollX,
  };
}

function getLayoutOffset(layout: KeyboardLayout[]) {
  const buttons = layout.flatMap((item) => item.elements);
  const offsets = buttons.map((x) => getOffset(x.id));
  return offsets;
}

function App() {
  const [row, setRow] = useState(4);
  const [col, setCol] = useState(10);
  const [layout, setLayout] = useState<KeyboardLayout[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (row > 0 && col > 0) setLayout(buildKeyboardLayout(row, col));
  }, [row, col]);

  const handleSelect = (id: string, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedId(id);

    if (!inputRef.current) return;
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setSelectedId(null);
  };

  const handleSetName = (name: string) => {
    if (!selectedId) return;
    const [rowId] = selectedId.split('-');
    setLayout((state) => {
      const layoutFoundIndex = layout.findIndex(
        (item: KeyboardLayout) => item.id === rowId
      );
      state[layoutFoundIndex] = {
        ...state[layoutFoundIndex],
        elements: layout[layoutFoundIndex]?.elements.map((button) => ({
          ...button,
          name: button.id === selectedId ? name : button.name,
        })),
      };
      return [...state];
    });
  };

  const handleSetMargin = (
    operation: 'add' | 'sub',
    side: 'left' | 'right'
  ) => {
    if (!selectedId) return;

    const action =
      operation === 'add'
        ? (margin: number | undefined) => (margin ?? 0) + 4
        : (margin: number | undefined) =>
            (margin ?? 0) - 4 < 0 ? 0 : (margin ?? 0) - 4;

    const [rowId] = selectedId.split('-');
    setLayout((state) => {
      const layoutFoundIndex = layout.findIndex(
        (item: KeyboardLayout) => item.id === rowId
      );
      state[layoutFoundIndex] = {
        ...state[layoutFoundIndex],
        elements: layout[layoutFoundIndex]?.elements.map((button) => ({
          ...button,
          margin:
            button.id === selectedId
              ? {
                  [side]: action(button?.margin?.[side]),
                }
              : button.margin,
        })),
      };
      return [...state];
    });
  };

  const handleRemove = () => {
    if (!selectedId) return;
    const [rowId] = selectedId.split('-');
    setLayout((state) => {
      const layoutFoundIndex = layout.findIndex(
        (item: KeyboardLayout) => item.id === rowId
      );
      state[layoutFoundIndex] = {
        ...state[layoutFoundIndex],
        elements: layout[layoutFoundIndex]?.elements.filter(
          (item) => item.id !== selectedId
        ),
      };
      return [...state];
    });
  };

  const handleSetSize = (operation: 'add' | 'sub') => {
    if (!selectedId) return;

    const action =
      operation === 'add'
        ? (size: number | undefined) => (size ?? 0) + 1
        : (size: number | undefined) =>
            (size ?? 0) - 1 < 0 ? 0 : (size ?? 0) - 1;

    const [rowId] = selectedId.split('-');
    setLayout((state) => {
      const layoutFoundIndex = layout.findIndex(
        (item: KeyboardLayout) => item.id === rowId
      );
      state[layoutFoundIndex] = {
        ...state[layoutFoundIndex],
        elements: layout[layoutFoundIndex]?.elements.map((button) => ({
          ...button,
          size: button.id === selectedId ? action(button.size) : button.size,
        })),
      };
      return [...state];
    });
  };

  const handleGetPositions = () => {
    const offsets = getLayoutOffset(layout);
    console.log(offsets);
  };

  const handlePlaceBoxInSelectedPosition = () => {
    if (!selectedId) return;

    const offset = getOffset(selectedId);

    const box = document.getElementById('box');

    if (!box) return;

    box.style.top = `${offset.top}px`;
    box.style.left = `${offset.left}px`;
  };

  return (
    <>
      <div id='box' className='positioning_box' />
      <div className='selected_container'>
        <div className='selected_box'>
          <span>selected: {selectedId} </span>
          <button onClick={handleRemove}>Remove</button>
        </div>
        <section>
          <div>
            <h5>Margin left:</h5>
            <button onClick={() => handleSetMargin('add', 'left')}>+</button>
            <button onClick={() => handleSetMargin('sub', 'left')}>-</button>
          </div>
          <div>
            <h5>Margin Right:</h5>
            <button onClick={() => handleSetMargin('add', 'right')}>+</button>
            <button onClick={() => handleSetMargin('sub', 'right')}>-</button>
          </div>
        </section>
        <section>
          <div>
            <h5>Width:</h5>
            <button onClick={() => handleSetSize('add')}>+</button>
            <button onClick={() => handleSetSize('sub')}>-</button>
          </div>
        </section>
        <div>
          <label htmlFor='name'>Name: </label>
          <input
            ref={inputRef}
            autoComplete='off'
            id='name'
            name='name'
            disabled={!selectedId}
            onChange={(e) => handleSetName(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleGetPositions}>
            get all positions of layout
          </button>
          <button onClick={handlePlaceBoxInSelectedPosition}>
            Place the box in the same position
          </button>
        </div>
      </div>
      <div className='container'>
        <div className='input_container'>
          <div>
            <label htmlFor='row'>Row:</label>
            <input
              id='row'
              name='row'
              value={row}
              onChange={(e) => setRow(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor='col'>Col:</label>
            <input
              id='col'
              name='col'
              value={col}
              onChange={(e) => setCol(Number(e.target.value))}
            />
          </div>
        </div>

        <div className='card' onClick={handleClickOutside}>
          <DragDropContext onDragEnd={console.log}>
            <div className='keyboard'>
              {layout.map(
                (item: {
                  id: string;
                  elements: Array<{ id: string; element: JSX.Element }>;
                }) => {
                  return (
                    <Droppable key={item.id} droppableId={item.id}>
                      {(provide) => (
                        <div
                          key={item.id}
                          className={classNames('keyboard__row')}
                          {...provide.droppableProps}
                          ref={provide.innerRef}
                        >
                          {provide.placeholder}
                          {item.elements.map(
                            ({ id, element, ...props }, index) => {
                              return (
                                <Draggable
                                  key={id}
                                  disableInteractiveElementBlocking={true}
                                  draggableId={id}
                                  index={index}
                                >
                                  {(provided) =>
                                    cloneElement(element, {
                                      id,
                                      selected: selectedId === id,
                                      onClick: handleSelect,
                                      ...props,
                                      ...provided.draggableProps,
                                      ...provided.dragHandleProps,
                                      innerRef: provided.innerRef,
                                    })
                                  }
                                </Draggable>
                              );
                            }
                          )}
                        </div>
                      )}
                    </Droppable>
                  );
                }
              )}
            </div>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default App;
