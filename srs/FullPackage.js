
"use strict";

var RainOnMe = `variables
{
    global:
        0: _extendedGlobalCollection
        1: _arrayBuilder
        2: AllPos
        3: AllDir
        4: firstpos
        5: secondpos
        6: firstpoint2
        7: secondpoint2
        8: second
        9: z
        10: Wall_ID
        11: showwalls
        12: destroyall
        13: _arrayBuilder_0
        14: beam_ID
        15: g_beamType
        16: initialized
        17: x
    player:
        0: _extendedPlayerCollection
        1: filterpos
        2: lastsavedpos
        3: closestbodypos
        4: fullbodypos
        5: prevpos_intersection
        6: active_wall
        7: closestwall
        8: x
        9: intersection_length
        10: thickness
        11: intersection_length_0
        12: intersection_length_1
        13: thickness_0
        14: horizontal_intersection
        15: intersection_length_2
        16: downwardslope
        17: velocitySlope
}

// Extended collection variables:
// global [0]: _arrayBuilderStore

// Class identifiers:

rule("Initial Global")
{

    event
    {
        Ongoing - Global;
    }

    // Action count: 12
    actions
    {
        Set Global Variable(AllPos, Empty Array);
        Set Global Variable(AllDir, Empty Array);
        Set Global Variable(firstpos, Empty Array);
        Set Global Variable(secondpos, Empty Array);
        Set Global Variable(firstpoint2, Empty Array);
        Set Global Variable(secondpoint2, Empty Array);
        Set Global Variable(second, Empty Array);
        Set Global Variable(z, Empty Array);
        Set Global Variable(Wall_ID, Empty Array);
        Set Global Variable(beam_ID, Empty Array);
        Set Global Variable(g_beamType, Empty Array);
        Set Global Variable(initialized, False);
    }
}

rule("Initial Player")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    // Action count: 6
    actions
    {
        Set Player Variable(Event Player, filterpos, 0);
        Set Player Variable(Event Player, lastsavedpos, 0);
        Set Player Variable(Event Player, closestbodypos, 0);
        Set Player Variable(Event Player, fullbodypos, Position of(Event Player));
        Set Player Variable(Event Player, prevpos_intersection, Position of(Event Player));
        Set Player Variable(Event Player, active_wall, Empty Array);
    }
}

rule("Collision Logic")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Global Variable(initialized) == True;
    }

    // Action count: 206
    actions
    {
        Set Player Variable At Index(Event Player, lastsavedpos, Global Variable(z), Player Variable(Event Player, fullbodypos));
        Wait(0.016, Ignore Condition);
        Set Player Variable(Event Player, closestwall, Filtered Array(Global Variable(AllPos), Or(Or(Or(Compare(Distance Between(Add(Event Player, Multiply(Value In Array(Global Variable(AllDir), Current Array Index), Divide(Dot Product(Subtract(Current Array Element, Event Player), Value In Array(Global Variable(AllDir), Current Array Index)), Dot Product(Value In Array(Global Variable(AllDir), Current Array Index), Value In Array(Global Variable(AllDir), Current Array Index))))), Event Player), <, 2), Compare(Compare(Dot Product(Direction Towards(Current Array Element, Value In Array(Player Variable(Event Player, lastsavedpos), Current Array Index)), Value In Array(Global Variable(AllDir), Current Array Index)), >, 0), !=, Compare(Dot Product(Direction Towards(Current Array Element, Event Player), Value In Array(Global Variable(AllDir), Current Array Index)), >, 0))), Compare(Value In Array(Player Variable(Event Player, active_wall), Current Array Index), ==, 1)), Compare(Value In Array(Global Variable(Wall_ID), Current Array Index), ==, 6))));
        For Player Variable(Event Player, x, 0, Count Of(Player Variable(Event Player, closestwall)), 1);
        	Set Global Variable(z, Index Of Array Value(Global Variable(AllPos), Value In Array(Player Variable(Event Player, closestwall), Player Variable(Event Player, x))));
        	If(Or(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3)), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 5)));
        		If(And(Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), >=, Y Component Of(Position of(Event Player))), Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), <=, Y Component Of(Add(Eye Position(Event Player), Vector(Empty Array, 0.2, Empty Array))))));
        			Set Player Variable(Event Player, closestbodypos, Value In Array(Global Variable(firstpos), Global Variable(z)));
        		Else If(And(Compare(Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), >=, Y Component Of(Position of(Event Player))), Compare(Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), <=, Y Component Of(Add(Eye Position(Event Player), Vector(Empty Array, 0.2, Empty Array))))));
        			Set Player Variable(Event Player, closestbodypos, Value In Array(Global Variable(secondpos), Global Variable(z)));
        		Else;
        			Set Player Variable(Event Player, closestbodypos, Position of(Event Player));
        		End;
        		Set Player Variable(Event Player, fullbodypos, Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Player Variable(Event Player, closestbodypos)), Z Component Of(Eye Position(Event Player))));
        		Set Player Variable(Event Player, filterpos, Add(Player Variable(Event Player, fullbodypos), Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Value In Array(Global Variable(AllDir), Global Variable(z)), Value In Array(Global Variable(AllDir), Global Variable(z)))))));
        		If(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3)));
        			If(Compare(Count Of(Global Variable(firstpos)), >, 0));
        				Set Player Variable(Event Player, intersection_length, Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z)))));
        				Set Player Variable(Event Player, prevpos_intersection, Add(Player Variable(Event Player, fullbodypos), Multiply(Multiply(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Vector(1, Empty Array, 1)), Player Variable(Event Player, intersection_length))));
        				If(Compare(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0), !=, Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0)));
        					If(And(And(And(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)));
        						Cancel Primary Action(Event Player);
        						Teleport(Event Player, Add(Player Variable(Event Player, prevpos_intersection), Multiply(Direction Towards(Player Variable(Event Player, prevpos_intersection), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), 1.001)));
        					End;
        				End;
        			End;
        		End;
        		Set Player Variable(Event Player, thickness, 0);
        		If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 5));
        			Set Player Variable(Event Player, thickness, 4);
        		Else;
        			Set Player Variable(Event Player, thickness, 1);
        		End;
        		If(And(And(And(And(Compare(Distance Between(Player Variable(Event Player, fullbodypos), Player Variable(Event Player, filterpos)), <=, Player Variable(Event Player, thickness)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)));
        			If(Compare(Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, ==, 1))), ==, 0));
        				Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 1);
        				If(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3)));
        					Set Gravity(Event Player, 100);
        				Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 5));
        					Disable Movement Collision With Environment(Event Player, False);
        				End;
        			End;
        			If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1));
        				If(Compare(Distance Between(Player Variable(Event Player, fullbodypos), Player Variable(Event Player, filterpos)), <=, 0.8));
        					Set Player Variable(Event Player, intersection_length_0, Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation)), Value In Array(Global Variable(AllDir), Global Variable(z)))));
        					Set Player Variable(Event Player, prevpos_intersection, Add(Player Variable(Event Player, fullbodypos), Multiply(Multiply(Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation)), Vector(1, Empty Array, 1)), Player Variable(Event Player, intersection_length_0))));
        					Apply Impulse(Event Player, Multiply(Direction Towards(Player Variable(Event Player, prevpos_intersection), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Vector(1, Empty Array, 1)), 0.001, To World, Cancel Contrary Motion);
        				End;
        				Apply Impulse(Event Player, Multiply(Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), Vector(1, Empty Array, 1)), 0.001, To World, Cancel Contrary Motion);
        				Start Throttle In Direction(Event Player, Null, False, To World, Add To Existing Throttle, None);
        			Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3));
        				Apply Impulse(Event Player, Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), 10, To World, Cancel Contrary Motion);
        			End;
        		Else;
        			Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 0);
        		End;
        	Else If(Or(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 2), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 6)), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 7)));
        		If(And(Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), >=, Y Component Of(Position of(Event Player))), Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), <=, Y Component Of(Add(Eye Position(Event Player), Vector(Empty Array, 0.2, Empty Array))))));
        			Set Player Variable(Event Player, closestbodypos, Value In Array(Global Variable(firstpos), Global Variable(z)));
        		Else If(Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), <=, Y Component Of(Position of(Event Player))));
        			Set Player Variable(Event Player, closestbodypos, Position of(Event Player));
        		Else If(Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), >=, Y Component Of(Eye Position(Event Player))));
        			Set Player Variable(Event Player, closestbodypos, Eye Position(Event Player));
        		End;
        		Set Player Variable(Event Player, fullbodypos, Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Player Variable(Event Player, closestbodypos)), Z Component Of(Eye Position(Event Player))));
        		Set Player Variable(Event Player, filterpos, Add(Player Variable(Event Player, fullbodypos), Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Value In Array(Global Variable(AllDir), Global Variable(z)), Value In Array(Global Variable(AllDir), Global Variable(z)))))));
        		If(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 2), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 7)));
        			If(Not(Is On Ground(Event Player)));
        				If(Compare(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0), !=, Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0)));
        					Set Player Variable(Event Player, intersection_length_1, Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z)))));
        					Set Player Variable(Event Player, prevpos_intersection, Add(Player Variable(Event Player, fullbodypos), Multiply(Multiply(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Up), Player Variable(Event Player, intersection_length_1))));
        					If(Compare(Dot Product(Down, Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >, 0));
        						If(And(And(And(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)));
        							Cancel Primary Action(Event Player);
        							If(Compare(Hero Of(Event Player), ==, Hero(Wrecking Ball)));
        								Teleport(Event Player, Nearest Walkable Position(Player Variable(Event Player, prevpos_intersection)));
        								Wait(0.016, Ignore Condition);
        								Teleport(Event Player, Add(Player Variable(Event Player, prevpos_intersection), Up));
        							Else;
        								Teleport(Event Player, Add(Player Variable(Event Player, prevpos_intersection), Multiply(Direction Towards(Player Variable(Event Player, prevpos_intersection), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Up)));
        							End;
        						End;
        					End;
        				End;
        			End;
        		End;
        		Set Player Variable(Event Player, thickness_0, 0);
        		If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 6));
        			Set Player Variable(Event Player, thickness_0, 6);
        		Else;
        			Set Player Variable(Event Player, thickness_0, 0.5);
        		End;
        		If(And(And(And(And(Compare(Distance Between(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), <=, Player Variable(Event Player, thickness_0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)));
        			If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 2));
        				If(Compare(Dot Product(Down, Direction Towards(Player Variable(Event Player, fullbodypos), Player Variable(Event Player, filterpos))), >, 0));
        					If(Compare(Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, ==, 1))), ==, 0));
        						Set Gravity(Event Player, 0);
        						Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 1);
        					End;
        					If(Compare(Player Variable(Event Player, closestbodypos), ==, Value In Array(Global Variable(firstpos), Global Variable(z))));
        						Set Player Variable(Event Player, horizontal_intersection, Add(Player Variable(Event Player, fullbodypos), Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Value In Array(Global Variable(AllDir), Global Variable(z)), Value In Array(Global Variable(AllDir), Global Variable(z)))))));
        						Apply Impulse(Event Player, Multiply(Direction Towards(Player Variable(Event Player, horizontal_intersection), Player Variable(Event Player, fullbodypos)), Vector(1, Empty Array, 1)), 0.001, To World, Cancel Contrary Motion);
        					Else;
        						Apply Impulse(Event Player, Up, 0.001, To World, Cancel Contrary Motion);
        					End;
        					If(Is Button Held(Event Player, Jump));
        						Apply Impulse(Event Player, Up, 5.5, To World, Cancel Contrary Motion);
        					End;
        					If(Compare(Throttle Of(Event Player), !=, Vector(Empty Array, Empty Array, Empty Array)));
        						Apply Impulse(Event Player, Cross Product(Up, Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation))), 0.001, To World, Cancel Contrary Motion);
        						Apply Impulse(Event Player, Cross Product(Down, Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation))), 0.001, To World, Cancel Contrary Motion);
        						Apply Impulse(Event Player, Direction Towards(Eye Position(Event Player), Add(Eye Position(Event Player), Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation)))), 3, To World, Cancel Contrary Motion);
        					Else;
        						If(Not(Is Button Held(Event Player, Jump)));
        							Apply Impulse(Event Player, Down, 0.001, To World, Cancel Contrary Motion);
        						End;
        						If(Compare(Speed Of(Event Player), >, 0.01));
        							Apply Impulse(Event Player, Left, 0.001, To World, Cancel Contrary Motion);
        							Apply Impulse(Event Player, Right, 0.001, To World, Cancel Contrary Motion);
        							Apply Impulse(Event Player, Forward, 0.001, To World, Cancel Contrary Motion);
        							Apply Impulse(Event Player, Backward, 0.001, To World, Cancel Contrary Motion);
        						End;
        					End;
        				Else;
        					Apply Impulse(Event Player, Down, 0.001, To World, Cancel Contrary Motion);
        				End;
        			Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 6));
        				If(Compare(Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, ==, 1))), ==, 0));
        					Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 1);
        					Disable Movement Collision With Environment(Event Player, True);
        				End;
        			Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 7));
        				If(Compare(Dot Product(Down, Direction Towards(Player Variable(Event Player, fullbodypos), Player Variable(Event Player, filterpos))), >=, 0));
        					If(Is Button Held(Event Player, Jump));
        						Apply Impulse(Event Player, Up, 5.5, To World, Cancel Contrary Motion);
        					End;
        					If(Compare(Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, ==, 1))), ==, 0));
        						Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 1);
        						Set Gravity(Event Player, 0);
        					End;
        					Apply Impulse(Event Player, Up, 0.001, To World, Cancel Contrary Motion);
        				Else;
        					Apply Impulse(Event Player, Down, 0.001, To World, Cancel Contrary Motion);
        				End;
        			End;
        		Else;
        			Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 0);
        		End;
        	Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 4));
        		Set Player Variable(Event Player, closestbodypos, Add(Position of(Event Player), Vector(Empty Array, 0.5, Empty Array)));
        		Set Player Variable(Event Player, fullbodypos, Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Player Variable(Event Player, closestbodypos)), Z Component Of(Eye Position(Event Player))));
        		Set Player Variable(Event Player, filterpos, Add(Player Variable(Event Player, fullbodypos), Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Value In Array(Global Variable(AllDir), Global Variable(z)), Value In Array(Global Variable(AllDir), Global Variable(z)))))));
        		If(Compare(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0), !=, Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0)));
        			Set Player Variable(Event Player, intersection_length_2, Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z)))));
        			Set Player Variable(Event Player, prevpos_intersection, Ray Cast Hit Position(Player Variable(Event Player, fullbodypos), Add(Player Variable(Event Player, fullbodypos), Multiply(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Player Variable(Event Player, intersection_length_2))), Null, Event Player, True));
        			If(And(And(And(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)));
        				Teleport(Event Player, Ray Cast Hit Position(Player Variable(Event Player, prevpos_intersection), Add(Player Variable(Event Player, prevpos_intersection), Multiply(Direction Towards(Player Variable(Event Player, prevpos_intersection), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Vector(1, Empty Array, 1))), Null, Event Player, True));
        				If(And(Compare(Hero Of(Event Player), ==, Hero(Doomfist)), Is Using Ability 2(Event Player)));
        					Teleport(Event Player, Nearest Walkable Position(Player Variable(Event Player, prevpos_intersection)));
        					Wait(0.016, Ignore Condition);
        					Teleport(Event Player, Ray Cast Hit Position(Player Variable(Event Player, prevpos_intersection), Add(Player Variable(Event Player, prevpos_intersection), Up), Null, Event Player, True));
        					Cancel Primary Action(Event Player);
        				Else If(Compare(Hero Of(Event Player), ==, Hero(Wrecking Ball)));
        					Cancel Primary Action(Event Player);
        					Teleport(Event Player, Nearest Walkable Position(Player Variable(Event Player, prevpos_intersection)));
        					Wait(0.016, Ignore Condition);
        					Teleport(Event Player, Ray Cast Hit Position(Player Variable(Event Player, prevpos_intersection), Add(Player Variable(Event Player, prevpos_intersection), Up), Null, Event Player, True));
        				End;
        				Apply Impulse(Event Player, Value In Array(Global Variable(AllDir), Global Variable(z)), 0.001, To World, Cancel Contrary Motion);
        			End;
        		End;
        		If(And(And(And(And(Compare(Distance Between(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), <=, 1), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Value In Array(Global Variable(firstpoint2), Global Variable(z))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)));
        			If(Compare(Dot Product(Up, Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, closestbodypos))), >, 0));
        				Set Player Variable(Event Player, downwardslope, Multiply(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Dot Product(Down, Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))))));
        				Set Player Variable(Event Player, velocitySlope, Multiply(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))), Dot Product(Velocity Of(Event Player), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Value In Array(Global Variable(secondpoint2), Global Variable(z))))));
        				If(Compare(Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, ==, 1))), ==, 0));
        					Set Gravity(Event Player, 0);
        					Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 1);
        				End;
        				Apply Impulse(Event Player, Up, 0.001, To World, Cancel Contrary Motion);
        				If(Compare(Dot Product(Velocity Of(Event Player), Player Variable(Event Player, downwardslope)), >=, 0));
        					Apply Impulse(Event Player, Vector(X Component Of(Velocity Of(Event Player)), Y Component Of(Player Variable(Event Player, velocitySlope)), Z Component Of(Velocity Of(Event Player))), Speed Of(Event Player), To World, Cancel Contrary Motion);
        					Start Accelerating(Event Player, Player Variable(Event Player, downwardslope), Multiply(17.5, Sine From Degrees(Angle Between Vectors(Down, Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), -1)))), 1000, To World, None);
        				Else If(And(Compare(Dot Product(Velocity Of(Event Player), Player Variable(Event Player, downwardslope)), <, 0), Compare(Throttle Of(Event Player), !=, Vector(Empty Array, Empty Array, Empty Array))));
        					Apply Impulse(Event Player, Vector(X Component Of(Velocity Of(Event Player)), Y Component Of(Player Variable(Event Player, velocitySlope)), Z Component Of(Velocity Of(Event Player))), Speed Of(Event Player), To World, Cancel Contrary Motion);
        					Start Accelerating(Event Player, Player Variable(Event Player, downwardslope), Multiply(17.5, Sine From Degrees(Angle Between Vectors(Down, Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), -1)))), 1000, To World, None);
        				Else If(And(Compare(Dot Product(Velocity Of(Event Player), Player Variable(Event Player, downwardslope)), <, 0), Compare(Throttle Of(Event Player), ==, Vector(Empty Array, Empty Array, Empty Array))));
        					Apply Impulse(Event Player, Vector(X Component Of(Velocity Of(Event Player)), Y Component Of(Player Variable(Event Player, velocitySlope)), Z Component Of(Velocity Of(Event Player))), Horizontal Speed Of(Event Player), To World, Cancel Contrary Motion);
        					Start Accelerating(Event Player, Player Variable(Event Player, downwardslope), Multiply(17.5, Sine From Degrees(Angle Between Vectors(Down, Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), -1)))), 1000, To World, None);
        				End;
        				If(Compare(Sine From Degrees(Angle Between Vectors(Down, Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), -1))), >, 10));
        					Apply Impulse(Event Player, Player Variable(Event Player, downwardslope), Multiply(Multiply(Speed Of(Event Player), Sine From Degrees(Angle Between Vectors(Down, Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), -1)))), 0.016), To World, Incorporate Contrary Motion);
        				Else;
        					Apply Impulse(Event Player, Player Variable(Event Player, downwardslope), Multiply(Speed Of(Event Player), 0.016), To World, Incorporate Contrary Motion);
        				End;
        			Else;
        				Apply Impulse(Event Player, Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), 0.001, To World, Cancel Contrary Motion);
        			End;
        		Else;
        			Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 0);
        		End;
        	End;
        	Set Player Variable(Event Player, fullbodypos, Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Player Variable(Event Player, closestbodypos)), Z Component Of(Eye Position(Event Player))));
        	Set Player Variable At Index(Event Player, lastsavedpos, Global Variable(z), Player Variable(Event Player, fullbodypos));
        End;
        Loop;
    }
}

rule("Reset")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, !=, 0))) == 0;
    }

    // Action count: 4
    actions
    {
        Set Gravity(Event Player, 100);
        Stop Forcing Throttle(Event Player);
        Stop Accelerating(Event Player);
        Enable Movement Collision With Environment(Event Player);
    }
}

rule("Throttle Loop")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Is True For Any(Player Variable(Event Player, active_wall), Current Array Element) == True;
    }

    // Action count: 3
    actions
    {
        Start Throttle In Direction(Event Player, Null, False, To World, Add To Existing Throttle, None);
        Wait(0.016, Ignore Condition);
        Loop If Condition Is True;
    }
}

rule("Throttle Loop")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    // Action count: 2
    actions
    {
        Wait(0.016, Ignore Condition);
        Loop If Condition Is True;
    }
}

rule("Effect Creation")
{

    event
    {
        Ongoing - Global;
    }

    // Action count: 150
    actions
    {
        Wait(5, Ignore Condition);
        If(Global Variable(showwalls));
        	For Global Variable(x, 0, Count Of(Global Variable(AllPos)), 1);
        		If(Or(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 1), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 3)), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 5)));
        			If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 5));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        			Else;
        Skip(Value In Array(Array(50, 0, 17, 34), Add(Index Of Array Value(Array(1, 2, 3), Value In Array(Global Variable(g_beamType), Global Variable(x))), 1)));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        Skip(33);
        				Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        Skip(16);
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        			End;
        		Else If(Or(Or(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 2), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 4)), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 6)), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 7)));
        			If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 6));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(secondpos), Global Variable(x)), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(secondpos), Global Variable(x)), Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(firstpos), Global Variable(x)), Red, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        			Else;
        Skip(Value In Array(Array(50, 0, 17, 34), Add(Index Of Array Value(Array(1, 2, 3), Value In Array(Global Variable(g_beamType), Global Variable(x))), 1)));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(secondpos), Global Variable(x)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Value In Array(Global Variable(secondpos), Global Variable(x)), Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Grapple Beam, Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(firstpos), Global Variable(x)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        Skip(33);
        				Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(secondpos), Global Variable(x)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(secondpos), Global Variable(x)), Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(firstpos), Global Variable(x)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        Skip(16);
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Count Of(Global Variable(beam_ID))));
        				Set Global Variable At Index(_arrayBuilder, 0, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Count Of(Global Variable(beam_ID)), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Add(Value In Array(Global Variable(firstpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(secondpos), Global Variable(x)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 1, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Value In Array(Global Variable(secondpos), Global Variable(x)), Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 2, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        				Create Beam Effect(All Players(Team(All)), Bad Beam, Add(Value In Array(Global Variable(secondpoint2), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Value In Array(Global Variable(firstpos), Global Variable(x)), Aqua, None);
        				Set Global Variable(_arrayBuilder, Value In Array(Global Variable(beam_ID), Subtract(Count Of(Global Variable(beam_ID)), 1)));
        				Set Global Variable At Index(_arrayBuilder, 3, Last Created Entity);
        				Set Global Variable At Index(beam_ID, Subtract(Count Of(Global Variable(beam_ID)), 1), Global Variable(_arrayBuilder));
        			End;
        		End;
        		Wait(0.016, Ignore Condition);
        	End;
        End;
        Set Global Variable(initialized, True);
    }
}`
