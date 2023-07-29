LIBRARY ieee;
USE ieee.std_logic_1164.ALL;

ENTITY test_entity_name IS
      GENERIC (
            a    : INTEGER;
            b    : STD_LOGIC := '1';
            c, d : STD_LOGIC_VECTOR(1 DOWNTO 0)
      );
      PORT (
            e    : IN STD_LOGIC; -- comment 0
            f    : OUT STD_LOGIC; -- comment 1
            g    : INOUT STD_LOGIC; -- comment 2
            h    : IN STD_LOGIC_VECTOR(31 DOWNTO 0); -- comment 3
            i    : IN STD_LOGIC_VECTOR(31 DOWNTO 0) := "0010"; -- comment 4
            j, k : IN STD_LOGIC                     := '1' -- comment 5
      );
END test_entity_name;

ARCHITECTURE e_arch OF test_entity_name IS
      SIGNAL m    : INTEGER;
      SIGNAL n, p : STD_LOGIC_VECTOR(1 DOWNTO 0);

      CONSTANT r    : INTEGER := 0;
      CONSTANT q, s : INTEGER := 0;

      FUNCTION counter(minutes : INTEGER := 0; seconds : INTEGER := 0)
            RETURN INTEGER IS VARIABLE total_seconds : INTEGER;
      BEGIN
      END FUNCTION;

BEGIN

      label_0 : PROCESS BEGIN
      END PROCESS;

      label_1 : PROCESS (a, b) BEGIN
            g <= '0';
      END PROCESS;

      half_adder_inst : ENTITY work.half_adder
            PORT MAP(
                  g => g,
                  h => h,
                  i => i
            );

      PROCESS (a) IS
      BEGIN
            IF rising_edge(a) THEN
                  IF b = '0' THEN
                        f <= d;
                  ELSE
                        CASE a IS

                              WHEN a =>
                                    f <= '1';
                                    -- If 5 seconds have passed
                                    IF b THEN
                                          f <= 0;
                                    END IF;

                              WHEN d =>
                                    f <= '1';
                                    IF c THEN
                                          f <= 0;
                                    END IF;

                        END CASE;

                  END IF;
            END IF;
      END PROCESS;

END e_arch;